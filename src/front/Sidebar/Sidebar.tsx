import EventEmitter from 'events';

import React from "react";
import styles from "./Sidebar.module.scss"

import { Select, Input, Checkbox, Row, Col, Collapse } from 'antd';

const { Option } = Select;
const { Search } = Input;
const { Panel } = Collapse;

import {
    spr_affinity,
    spr_sport,
    spr_zonetype,
    // spr_filter,
    // spr_icon_sport,
} from '.././mock/sprs';

import Group from '../Tilda_Icons_22_Sport/all_barbell.svg';
import fitnessGirl from './fitnessGirl.png';
import Line from './Line.png';
import { IFilter } from "../App";

interface SideBarProps {
    onChange: (state: any, doApply: boolean) => void,
    applyFilter: () => void,
    filter: IFilter,
    emitter: EventEmitter,
    toggleIsPopulationLayer: () => void,
    isPopulationLayer: boolean
    toggleIsCoverNet: () => void,
    isCoverNet: boolean
    toggleIsAvailOnClick: () => void,
    isAvailOnClick: boolean
};

interface SideBarState {
    sideBarVisibility: boolean,
    selectValue: string,
};

export class Sidebar extends React.Component<SideBarProps, SideBarState> {
    constructor(props) {
        super(props);

        this.state = {
            sideBarVisibility: true,
            selectValue: '1'
        }
    }

    toggleSideBar = () => {
        this.setState({
            sideBarVisibility: !this.state.sideBarVisibility
        })
    }

    handleChange = (value: string) => {
        console.log(value)
        this.setState({
            selectValue: value
        })
    }

    render() {
        return (
            <div className={this.state.sideBarVisibility ? `${styles.sidebar}` : `${styles.sidebar} ${styles.sidebarHidden}`}>
                <div className={styles.wrapper}>
                    {/* <div className={styles.mixGroup}>
                        <Checkbox.Group style={{ width: 300 }}>
                            <div className={styles.text}>Доступность</div>
                            <Row>
                                {Object.keys(spr_distance).map(key => <Col key={key} span={24}><Checkbox value={key} className={styles.checkbox}>{spr_distance[key]}</Checkbox> </Col>)}
                            </Row>
                        </Checkbox.Group>
                    </div> */}

                    <div className={styles.mix}>
                        <div className={styles.text}>Название спортивного объекта</div>
                        <Search placeholder="Введите часть названия" allowClear style={{ width: 300 }}
                            onChange={(event) => {
                                console.log(event);
                                let value = event.target.value;
                                this.props.onChange({
                                    name: value
                                }, false);
                            }}
                            onBlur={(event) => {
                                // console.log('onBlur');
                                this.props.applyFilter();
                            }}
                        />
                    </div>

                    <div className={styles.mix}>
                        <div className={styles.text}>Ведомственная принадлежность</div>
                        <Search placeholder="Введите часть названия" allowClear style={{ width: 300 }}
                            onChange={(event) => {
                                let value = event.target.value;
                                this.props.onChange({
                                    org: value
                                }, false);
                            }}
                            onBlur={() => {
                                // console.log('onBlur');
                                this.props.applyFilter();
                            }}
                        />
                    </div>

                    <div className={styles.mix}>
                        <div className={styles.text}>Наименование спортивных зон</div>
                        <Search placeholder="Введите часть названия" allowClear style={{ width: 300 }}
                            onChange={(event) => {
                                let value = event.target.value;
                                this.props.onChange({
                                    sportzone: value
                                }, false);
                            }}
                            onBlur={(event) => {
                                // console.log('onBlur');
                                this.props.applyFilter();
                            }}
                        />
                    </div>

                    <div className={styles.mix}>
                        <div className={styles.text}>Тип спортивной зоны</div>
                        <Select
                            defaultValue="Все"
                            style={{ width: 300 }}
                            className={styles.select}
                            onChange={(value) => {
                                value = +value as any;
                                this.props.onChange({
                                    zonetypeId: value
                                }, true);
                            }}
                        >
                            <Option key={0} value={0}>Все</Option>
                            {Object.keys(spr_zonetype).map(key => <Option key={key} value={key}>{spr_zonetype[key]}</Option>)}
                        </Select>
                    </div>

                    <div className={styles.mix}>
                        <div className={styles.text}>Вид спорта</div>
                        <Select
                            defaultValue="Все"
                            style={{ width: 300 }}
                            className={styles.select}
                            onChange={(value) => {
                                value = +value as any;
                                this.props.onChange({
                                    sportId: value
                                }, true);
                            }}
                        >
                            <Option key={0} value={0}>Все</Option>
                            {Object.keys(spr_sport).map(key => <Option key={key} value={key}>
                                <img src={Group} alt="" className={styles.selectImg} />{spr_sport[key]}</Option>)}
                        </Select>
                    </div>

                    <div className={styles.mix}>
                        <div className={styles.text}>Доступность</div>
                        <Select
                            defaultValue="Все"
                            style={{ width: 300 }}
                            className={styles.select}
                            onChange={(value) => {
                                value = +value as any;
                                this.props.onChange({
                                    affinityId: value
                                }, true);
                            }}
                        >
                            <Option key={0} value={0}>Все</Option>
                            {Object.keys(spr_affinity).map(key => <Option key={key} value={key}>
                                <img src={Group} alt="" className={styles.selectImg} />{spr_affinity[key]}</Option>)}
                        </Select>
                    </div>

                    <div className={styles.mix}>
                        <button onClick={() => { this.props.emitter.emit('clearCircles'); }}>Очистить круги доступности</button>
                    </div>

                    <div className={styles.mix}>
                        <button onClick={() => { 
                            this.props.toggleIsPopulationLayer();
                        }}>{this.props.isPopulationLayer ? 'Убрать' : 'Показать'} плотность населения</button>
                    </div>

                    <div className={styles.mix}>
                        <button onClick={() => {
                            this.props.toggleIsCoverNet();
                        }}>{this.props.isCoverNet ? 'Убрать' : 'Наложить'} сетку охвата</button>
                    </div>

                    <div className={styles.mix}>
                        <button onClick={() => { 
                            this.props.toggleIsAvailOnClick();
                        }}>{this.props.isAvailOnClick ? "Отключить" : "Включить"} режим анализа по клику</button>
                    </div>

                    <img src={fitnessGirl} alt="" className={styles.fitnessGirl} />
                </div>
                <div onClick={this.toggleSideBar} className={styles.circle}>
                    {
                        !this.state.sideBarVisibility ? (
                            <img src={Line} alt="" className={`${styles.line} ${styles.show}`} />
                        ) : (
                            <img src={Line} alt="" className={`${styles.line}`} />
                        )
                    }
                </div>
            </div>
        )
    }
}