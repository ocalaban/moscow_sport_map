import * as React from 'react';

import { IDistrict, IObj } from '../mid/misc/types';
import getDistrictsWithCalc from '../mid/misc/helpers';

const XLSX = require('xlsx');

import './Table.scss';

interface ITableProps {
    objs: IObj[],
}

interface ITableState {
    isOnlyOldRegions?: boolean,
    districts: IDistrict[],
    orderField: string,
    isAsc: boolean
}

const base = {
    'name': { name: 'Район', isAscDefault: true }, // isAsc by default
    'region': { name: 'Округ', isAscDefault: true },
    'square': { name: 'Площадь, га', isAscDefault: false },
    'population': { name: 'Население, чел.', isAscDefault: false },
    'density': { name: 'Плотность, чел./га', isAscDefault: false },
    'sumSpecific': { name: 'Удельная площадь с/з', isAscDefault: false },
    'countSpecific': { name: 'Удельное кол-во с/з', isAscDefault: false },
    'countRolesSpecific': { name: 'Удельное кол-во видов услуг', isAscDefault: false }
}

export default class Table extends React.Component<ITableProps, ITableState> {
    constructor(props) {
        super(props);

        this.state = {
            districts: getDistrictsWithCalc(props.objs),
            orderField: 'name',
            isAsc: base['name'].isAscDefault,
        };
    }

    shouldComponentUpdate(nextProps) {
        // ALPATTERN!
        if (this.props.objs !== nextProps.objs) { // пришли новые объекты после фильтрации
            this.setState({
                districts: getDistrictsWithCalc(nextProps.objs)
            }, () => {
                this.setOrder(this.state.orderField, false);
            });

            return false;
        }

        return true;
    }

    render() {
        console.log('render()');
        
        let districtsToShow: IDistrict[] = (this.state.districts).filter((row: IDistrict) => {
            let res = true;

            if (this.state.isOnlyOldRegions) {
                res = !['НАО', 'ТАО', 'ЗелАО'].includes(row.region);
            }

            return res;
        });

        return (<>
            <div>
                <button onClick={() => {
                    this.setState((state) => {
                        return {
                            isOnlyOldRegions: !state.isOnlyOldRegions
                        };
                    })
                }}>
                    Экспортировать в XLSX
                </button>
            </div>
            {/* <div>
                <button onClick={() => {
                    this.setState((state) => {
                        return {
                            isOnlyOldRegions: !state.isOnlyOldRegions
                        };
                    })
                }}>
                    {this.state.isOnlyOldRegions ? "Показать" : "Убрать"} новые округа
                </button>
            </div> */}
            <table>
                <thead>
                    <tr>
                        {Object.keys(base).map((key) =>
                        (<th
                            style={{ cursor: 'pointer' }}
                            key={key}
                            onClick={() => {
                                this.setOrder(key, true);
                            }}
                        >
                            {base[key].name}
                            {this.getOrderSignSpan(key)}
                        </th>))}
                    </tr>
                </thead>
                <tbody>
                    {districtsToShow.map((row, i) => <tr key={row.name}>
                        {Object.keys(base).map((key) =>
                        (<td key={key}>
                            {row[key]}
                        </td>))}
                    </tr>)}
                </tbody>
            </table>
        </>)
    }

    private getOrderSignSpan(field: string) {
        return (<span className="orderSign">{(this.state.orderField === field ? (this.state.isAsc ? <>&#9650;</> : <>&#9660;</>) : null)}</span>);
    }

    private setOrder(field: string, doChangeDirection: boolean) {
        let isAsc;

        if (this.state.orderField === field) {
            if (doChangeDirection) {
                isAsc = !this.state.isAsc;
            } else {
                isAsc = this.state.isAsc;
            }
        } else {
            isAsc = base[field].isAscDefault;
        }

        let districts = [...this.state.districts];

        districts = districts.sort((a, b) => {
            let res;
            if (a[field] <= b[field]) {
                res = isAsc ? -1 : 1;
            } else {
                res = isAsc ? 1 : -1;
            }

            return res;
        });

        this.setState({
            orderField: field,
            isAsc,
            districts
        })
    }
}
