import * as React from 'react';
import EventEmitter from 'events';

const DG = require('2gis-maps');

import { getInterjacentColorStr, IDistrict, IObj, IRGBA } from './types';

import {
    spr_affiinity,
    spr_sport,
    spr_zonetype
} from './mock/sprs';

interface IMapMainProps {
    objs: IObj[],
    emitter: EventEmitter,
    isPopulationLayer?: boolean,
    districts: IDistrict[]
}

interface IMapMainState {

}

const clusterParams = {
    spiderfyOnMaxZoom: false,
    showCoverageOnHover: false,
    maxClusterRadius: 50,
    disableClusteringAtZoom: 18
}

export default class MapMain extends React.Component<IMapMainProps, IMapMainState> {
    map;
    cluster;

    circles = [];
    polys = [];

    prevProps;

    constructor(props) {
        super(props);

        this.state = {

        }

        props.emitter.on('clearCircles', () => {
            this.circles.forEach(circle => {
                circle.removeFrom(this.map);
            })

            this.circles = [];
        });
    }

    formPopupInnerHTML(obj: IObj) {
        let affinityName = spr_affiinity[obj.affinityId];

        let res = `
            <div class="popup" title="id: ${obj.id}">
                <!-- div class="fieldCont">
                    ${obj.lat} - ${obj.lng}
                </div -->
                <div class="fieldCont">
                    <div class="label">Наименование спортивного объекта</div>
                    <div class="value">${obj.name}</div>
                </div>
                <div class="fieldCont">
                    <div class="label">Ведомственная принадлежность</div>
                    <div class="value">${obj.org || '-'}</div>
                </div>
                <div class="fieldCont">
                    <div class="label">Общая площадь, кв.м.</div>
                    <div class="value">${obj.square || '-'}</div>
                </div>
                <div class="section">`;

        obj?.parts.forEach((part, i) => {
            let zonetypeName = spr_zonetype[part.sportzonetypeId];

            if (i) {
                res += `<div class="preborder"></div>`;
            }

            res +=
                `
                    <div class="fieldCont">
                        <div class="label">Спортивная зона ${i + 1}</div>
                        <div class="value">${part.sportzone}</div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Тип</div>
                        <div class="value">${zonetypeName || '-'}</div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Площадь, кв.м.</div>
                        <div class="value">${part.square || '-'}</div>
                    </div>
                    <div class="fieldCont">
                        <div class="label">Виды спорта</div>
                        <div class="sports">
                            ${part.roles.map((sportId) => `<div class="value">${spr_sport[sportId]}</div>`).join('\n')}
                        </div>
                    </div>
                `;

        });

        res += `
            </div>
            <div class="fieldCont">
                    <div class="label">Доступность</div>
                    <div class="value">${affinityName}</div>
                </div>
            </div>
        `;

        return res;
    }

    render() {
        return (
            <div
                id="map"
                style={{ width: '100%', height: '100%' }}
                ref={(node) => {
                    if (node) {
                        if (!this.map) {

                            this.map = DG.map('map', {
                                'center': [55.64, 37.80],
                                'zoom': 13
                            });

                            // let l1 = {lat: 55.640000, lng: 37.800000};
                            // let l2 = {lat: 55.6401, lng: 37.8001};
                            
                            // DG.marker(l1).addTo(this.map);
                            // DG.marker(l2).addTo(this.map);

                            // console.log(this.map.distance(l1, l2));
                            // return;

                            this.map.on('click', (event) => {
                                let sum = 0;
                                let count = 0;
                                let wasIn = false;

                                this.circles.forEach((circle) => {
                                    let dist = this.map.distance(event.latlng, circle._latlng);
                                    let isIn = dist <= circle.options.radius;

                                    if (isIn) {
                                        wasIn = true;
                                        sum += (circle.square || 0); // на всякий случай, по идее 0 всегда
                                        count += 1;
                                    }

                                });

                                if (wasIn) {
                                    DG.popup()
                                        .setLatLng(event.latlng)
                                        .setContent(`<div><div>Объектов в доступе: ${count}</div><div>Общая площадь, кв.м.: ${sum}</div></div>`)
                                        .openOn(this.map);
                                }
                            })
                        }

                        if (this.prevProps?.objs !== this.props.objs) {
                            if (this.cluster) {
                                this.map.removeLayer(this.cluster);
                            }

                            let cluster = DG.markerClusterGroup(clusterParams);

                            this.props.objs.forEach(obj => {
                                let popupContent = this.formPopupInnerHTML(obj);

                                let marker = DG.marker(obj);
                                marker.bindPopup(popupContent);

                                cluster.addLayer(marker);
                                let that = this;

                                let radii = [5000, 3000, 1000, 500];
                                let radius = radii[obj.affinityId - 1];

                                let step;

                                if (obj.square && Math.log10(obj.square) > 1) {
                                    step = Math.floor(Math.log(obj.square));
                                } else {
                                    step = 1;
                                }

                                const stepCount = 14;

                                const rgb1 = [255, 0, 0, 1] as IRGBA;
                                const rgb2 = [0, 255, 0, 1] as IRGBA;

                                let rgbStr = getInterjacentColorStr(step, stepCount, rgb1, rgb2);
                                marker.on('click', function () {
                                    let circle = DG.circle([obj.lat, obj.lng], { radius, color: rgbStr }).addTo(that.map);
                                    circle.square = obj.square;

                                    that.circles.push(circle);
                                });
                            });

                            this.map.addLayer(cluster);
                            this.cluster = cluster;
                        }

                        if (this.prevProps?.isPopulationLayer !== this.props.isPopulationLayer) {
                            this.polys.forEach((poly) => {
                                poly.removeFrom(this.map);
                            });

                            if (this.props.isPopulationLayer) {
                                this.props.districts.forEach(district => {
                                    const limit = 20;

                                    let dense = Math.floor(district[3] / district[2] / 10);
                                    if (dense > limit) {
                                        dense = limit;
                                    }

                                    const rgb1 = [0, 0, 255, 1] as IRGBA;
                                    const rgb2 = [255, 0, 0, 1] as IRGBA;

                                    let rgbStr = getInterjacentColorStr(dense, limit, rgb1, rgb2);

                                    let poly = DG.polygon(district[5][0], { color: rgbStr }).addTo(this.map);
                                    this.polys.push(poly);
                                });
                            }
                        }
                    }
                }}>
            </div>
        );
    }

    componentDidUpdate(prevProps, prevState) {
        this.prevProps = prevProps;
    }
}