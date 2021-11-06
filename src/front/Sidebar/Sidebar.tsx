import React from "react";
import styles from "./Sidebar.module.css"

import { Select, Input, Checkbox, Row, Col, Collapse } from 'antd';

const { Option } = Select;
const { Search } = Input;
const { Panel } = Collapse;

import {
  spr_distance,
  spr_sport,
  spr_zonetype,
  spr_filter,
  spr_icon_sport,
} from '.././mock/sprs';

import Group from '../Tilda_Icons_22_Sport/all_barbell.svg';
import fitnessGirl from './fitnessGirl.png';
import Line from './Line.png';

interface SideBarState {
  sideBarVisibility: boolean,
  selectValue: string,
};

interface SideBarProps {

};


export class Sidebar extends React.Component<SideBarProps, SideBarState> {

  state = {
    sideBarVisibility: true,
    selectValue: '1'
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
  
  render(){
    return(
      <div className={ this.state.sideBarVisibility ? `${styles.sidebar}` : `${styles.sidebar} ${styles.sidebarHidden}`}>
        <div className={styles.wrapper}>
        <div className={styles.mix}>
        <div className={styles.text}>Выберите вид фильтра</div>
          <Select onChange={this.handleChange} value={this.state.selectValue} style={{ width: 300 }} className={styles.select}>
            {Object.keys(spr_filter).map(key => <Option key={key} value={key}>{spr_filter[key]}</Option>)}
          </Select>
        </div>
        {
          this.state.selectValue === '1' && (
            <div className={styles.mixGroup}>
              <Checkbox.Group style={{ width: 300 }}>
                <div className={styles.text}>Доступность</div>
                <Row>
                  {Object.keys(spr_distance).map(key => <Col key={key} span={24}><Checkbox value={key} className={styles.checkbox}>{spr_distance[key]}</Checkbox> </Col>)}
                </Row>
              </Checkbox.Group>
            </div>  
          )
        }    
      
       {this.state.selectValue === '2' && ( 
          <div className={styles.mix}>
            <div className={styles.text}>Ввести название объекта</div>
             <Search placeholder="" allowClear style={{ width: 300 }} />
          </div>
         )
       }
       {this.state.selectValue === '3' && (
        <div className={styles.mix}>
          <div className={styles.text}>Ведомственная принадлежность</div>
          <Search placeholder="" allowClear style={{ width: 300 }} />
        </div>
          )
        }
          {this.state.selectValue === '5' && (
        <div className={styles.mix}>
          <div className={styles.text}>Тип спортивной зоны</div>
          <Select defaultValue="Все" style={{ width: 300 }} className={styles.select}>
               <Option key={0} value={0}>Все</Option>
              {Object.keys(spr_zonetype).map(key =>  <Option key={key} value={key}>{spr_zonetype[key]}</Option>)}
          </Select>
        </div>
        )
       }
         {this.state.selectValue === '6' && (
        <div className={styles.mix}>
        <div className={styles.text}>Вид спорта</div>
          <Select defaultValue="Все" style={{ width: 300 }}className={styles.select}>
              <Option key={0} value={0}>Все</Option>
              {Object.keys(spr_sport).map(key => <Option key={key} value={key}>
              <img src={Group} alt="" className={styles.selectImg}/>{spr_sport[key]}</Option>)}
          </Select>
        </div>
           )
          }
        <div className={styles.collapse}> 
          <Collapse style={{height: '100%'}}>
              <Panel header="Об объекте" key="1">
                  <div className={styles.mixPanel}>
                    <p className={styles.title}>Наименование</p>
                    <p className={styles.description}>Дворовая территория</p>
                  </div>
                  <div className={styles.mixPanel}>
                    <p className={styles.title}>Наименование</p>
                    <p className={styles.description}>Дворовая территория</p>
                  </div>
                  <div className={styles.mixPanel}>
                    <p className={styles.title}>Наименование</p>
                    <p className={styles.description}>Дворовая территория</p>
                  </div>
                  <div className={styles.mixPanel}>
                    <p className={styles.title}>Наименование</p>
                    <p className={styles.description}>Дворовая территория</p>
                  </div>
              </Panel>
          </Collapse>
        </div>
        <img src={fitnessGirl} alt="" className={styles.fitnessGirl}/>
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