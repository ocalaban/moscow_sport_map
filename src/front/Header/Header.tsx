import React from "react";
import styles from "./Header.module.scss"
import fitnessGroup from './fitnessGroup.png';

export class Header extends React.Component {
  render(){
    return(
      <div className={styles.header}>
        <div className={styles.text}>mapsport</div>
        <div className={styles.img}><img src={fitnessGroup} alt="" /></div>
      </div>
    )
  }
}