import React from "react";
import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import MapMain from "../MapMain";
import { Sidebar } from "../Sidebar/Sidebar";
import EventEmitter from 'events';

import { getInterjacentColorStr, IDistrict, IObj, IRGBA } from './../types';

interface HomePageState {

}

export interface HomePageProps {
  objs: IObj[],
  emitter: EventEmitter,
  isPopulationLayer?: boolean,
  districts: IDistrict[]
}

export class HomePage extends React.Component<HomePageProps, HomePageState> {
  render() {
    return (
      <>
        <Header />
        <div className="mapContainer">
            <MapMain
                objs={this.props.objs}
                emitter={this.props.emitter}
                isPopulationLayer={this.props.isPopulationLayer}
                districts={this.props.districts as any} /* IDistrict[] */
            />
        </div>
        <Sidebar />
        <Footer />
      </>
    )
  }
}