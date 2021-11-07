import * as React from 'react';
// const DG = require('2gis-maps');
import EventEmitter from 'events';

import MapMain from './MapMain';
import { getInterjacentColorStr, IObj, IRGBA } from '../mid/misc/types';

import objs from './mock/sport_objects.json';
import districts from './mock/districts.json';

import { Select } from 'antd';
const { Option } = Select;

import './App.scss';

const limitMarkers = +Infinity;
import {
    spr_affinity,
    spr_sport,
    spr_zonetype
} from './mock/sprs';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { Sidebar } from './Sidebar/Sidebar';
import { LoginPage } from './LoginPage/LoginPage';

import Table from './Table';

export interface IFilter {
    affinityId?: number,
    sportId?: number,
    zonetypeId?: number,
    name?: string,
    org?: string,
    sportzone?: string,
}

interface IAppProps {
}

interface IAppState {
    isEntranceRemoved?: boolean,
    objs: IObj[],
    filter: IFilter,
    isPopulationLayer?: boolean,
    isCoverNet?: boolean,
    isAvailOnClick?: boolean,
    isOnlyOldRegions?: boolean
}

class App extends React.Component<IAppProps, IAppState> {

    emitter: EventEmitter;

    constructor(props) {
        super(props);

        this.emitter = new EventEmitter;

        this.state = {
            isEntranceRemoved: true,
            objs: objs as unknown as IObj[],
            filter: {}
        }
    }

    applyFilter() {
        // console.log('applyFilter()');

        let newObjs = (objs as unknown as IObj[]).filter(obj => {
            let res = true;

            if (this.state.filter.affinityId) {
                res = res && obj.affinityId == this.state.filter.affinityId;
            }

            if (this.state.filter.sportId) {
                res = res && !!obj.parts.filter(part => {
                    return (part.roles as any).includes('' + (this.state.filter.sportId as any));
                }).length;
            }

            if (this.state.filter.zonetypeId) {
                res = res && !!obj.parts.filter(part => {
                    return part.sportzonetypeId == this.state.filter.zonetypeId;
                }).length;
            }

            if (this.state.filter.name) {
                res = res && obj.name.toLowerCase().includes(this.state.filter.name.toLowerCase());
            }

            if (this.state.filter.org) {
                res = res && obj.org?.toLowerCase().includes(this.state.filter.org.toLowerCase());
            }

            if (this.state.filter.sportzone) {
                res = res && !!obj.parts.filter(part => {
                    return part.sportzone?.toLowerCase().includes(this.state.filter.sportzone.toLowerCase());
                }).length;
            }

            return res;
        });

        this.setState({
            objs: newObjs
        });
    }

    render() {
        if (!this.state.isEntranceRemoved) {
            return (<LoginPage
                callback={() => {
                    this.setState({ isEntranceRemoved: true })
                }}
            />);
        } else {
            return (
                <>
                    <Header />
                    <div className="mapContainer">
                        <MapMain
                            objs={this.state.objs}
                            emitter={this.emitter}
                            isPopulationLayer={this.state.isPopulationLayer}
                            isCoverNet={this.state.isCoverNet}
                            isAvailOnClick={this.state.isAvailOnClick}
                            districts={districts as any} /* IDistrict[] */
                            sportId={this.state.filter.sportId}
                        />
                    </div>
                    <div style={{clear: 'both'}}></div>
                    <div className="analytics">
                        <Table
                            objs={this.state.objs}
                        />
                    </div>
                    <Sidebar
                        onChange={(filter, doApply) => {
                            console.log(filter);
                            let newFilter = { ...this.state.filter, ...filter };
                            this.setState({ filter: newFilter }, () => {
                                if (doApply) {
                                    this.applyFilter();
                                }
                            });
                        }}
                        emitter={this.emitter}
                        isPopulationLayer={this.state.isPopulationLayer}
                        toggleIsPopulationLayer={() => {
                            this.setState((state) => {
                                return { isPopulationLayer: !state.isPopulationLayer }
                            })
                        }}
                        isCoverNet={this.state.isCoverNet}
                        toggleIsCoverNet={() => {
                            this.setState((state) => {
                                return { isCoverNet: !state.isCoverNet }
                            })
                        }}
                        isAvailOnClick={this.state.isAvailOnClick}
                        toggleIsAvailOnClick={() => {
                            this.setState((state) => {
                                return { isAvailOnClick: !state.isAvailOnClick }
                            })
                        }}
                        applyFilter={this.applyFilter.bind(this)}
                        filter={this.state.filter}
                    />
                    <Footer />

                    {/* 
                    <div className="info">
                        <div style={{ width: 200, float: 'left' }}>
                            <div>Диапазоны площади объектов, кв.м.</div>
                            {Array(15).fill(0).map((v, i) => {
                                const rgb1 = [255, 0, 0, 1] as IRGBA;
                                const rgb2 = [0, 255, 0, 1] as IRGBA;

                                let rgbStr = getInterjacentColorStr(i, 15, rgb1, rgb2);

                                return (<React.Fragment key={i}>
                                    <div>
                                        <div style={{ width: 30, height: 20, backgroundColor: rgbStr, float: 'left' }}></div>
                                        <div style={{ float: 'left', paddingLeft: 5 }}>{2 ** i - 1}{(i < 14) ? (<>&ndash;{2 ** (i + 1) - 1}</>) : <>+</>}</div>
                                    </div>
                                    <div style={{ clear: 'both' }}></div>
                                </React.Fragment>);
                            })}
                        </div>
                        <div style={{ width: 200, float: 'left' }}>
                            <div>Диапазоны плотности населения</div>
                            {Array(20).fill(0).filter((v, i) => i % 2).map((v, i) => {
                                const rgb1 = [0, 0, 255, 1] as IRGBA;
                                const rgb2 = [255, 0, 0, 1] as IRGBA;

                                let rgbStr = getInterjacentColorStr(i, 9, rgb1, rgb2);
                                return (
                                    <React.Fragment key={i}>
                                        <div>
                                            <div style={{ width: 30, height: 20, backgroundColor: rgbStr, float: 'left' }}></div>
                                            <div style={{ float: 'left', paddingLeft: 5 }}>{i * 10}{(i < 9) ? (<>&ndash;{(i + 1) * 10}</>) : <>+</>}</div>
                                        </div>
                                        <div style={{ clear: 'both' }}></div>
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                </div> */}
                </>
            );
        }
    }
}

export default App;