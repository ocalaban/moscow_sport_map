import * as React from 'react';
// const DG = require('2gis-maps');
import EventEmitter from 'events';

import MapMain from './MapMain';
import {
  getInterjacentColorStr,
  IDistrict,
  IObj,
  IPart,
  IRGBA,
  keys_IObj,
  keys_IPart,
} from './types';

import objs from './mock/sport_objects.json';
import districts from './mock/population_data.json';

import './App.scss';

const limitMarkers = +Infinity;
import { spr_affiinity, spr_sport, spr_zonetype } from './mock/sprs';

interface IAppProps {}

interface IAppState {
  objs: IObj[],
  affinityId?: number,
  sportId?: number,
  zonetypeId?: number,
  name?: string,
  org?: string,
  sportzone?: string,
  isPopulationLayer?: boolean,
};

class App extends React.Component<IAppProps, IAppState> {
  emitter: EventEmitter;

  constructor(props) {
    super(props);

    this.emitter = new EventEmitter();

    this.state = {
      objs: objs as unknown as IObj[],
    };
  }

  applyFilter() {
    console.log('applyFilter()');

    let newObjs = (objs as unknown as IObj[]).filter((obj) => {
      let res = true;

      if (this.state.affinityId) {
        res = res && obj.affinityId == this.state.affinityId;
      }

      if (this.state.sportId) {
        res =
          res &&
          !!obj.parts.filter((part) => {
            return (part.roles as any).includes(
              '' + (this.state.sportId as any)
            );
          }).length;
      }

      if (this.state.zonetypeId) {
        res =
          res &&
          !!obj.parts.filter((part) => {
            return part.sportzonetypeId == this.state.zonetypeId;
          }).length;
      }

      if (this.state.name) {
        res =
          res && obj.name.toLowerCase().includes(this.state.name.toLowerCase());
      }

      if (this.state.org) {
        res =
          res && obj.org?.toLowerCase().includes(this.state.org.toLowerCase());
      }

      if (this.state.sportzone) {
        res =
          res &&
          !!obj.parts.filter((part) => {
            return part.sportzone
              ?.toLowerCase()
              .includes(this.state.sportzone.toLowerCase());
          }).length;
      }

      return res;
    });

    this.setState({
      objs: newObjs,
    });
  }

  render() {
    return (
      <>
        <div className='mapContainer'>
          <MapMain
            objs={this.state.objs}
            emitter={this.emitter}
            isPopulationLayer={this.state.isPopulationLayer}
            districts={districts as any} /* IDistrict[] */
          />
        </div>
        <div className='panel'>
          <div className='title'>Панель управления</div>

          <div className='inputContainer'>
            <div className='label'>Наименование спортивного объекта</div>
            <div className='inputWrapper'>
              <input
                name='name'
                value={this.state.name || ''}
                placeholder='Введите часть названия'
                onChange={(event) => {
                  let value = event.target.value;
                  this.setState({
                    name: value,
                  });
                }}
                onBlur={(event) => {
                  console.log('onBlur');
                  this.applyFilter();
                }}
              />
            </div>
          </div>

          <div className='inputContainer'>
            <div className='label'>Ведомственная принадлежность</div>
            <div className='inputWrapper'>
              <input
                name='org'
                value={this.state.org || ''}
                placeholder='Введите часть названия'
                onChange={(event) => {
                  let value = event.target.value;
                  this.setState({
                    org: value,
                  });
                }}
                onBlur={(event) => {
                  this.applyFilter();
                }}
              />
            </div>
          </div>

          <div className='inputContainer'>
            <div className='label'>Наименование спортивных зон</div>
            <div className='inputWrapper'>
              <input
                name='sportzone'
                value={this.state.sportzone || ''}
                placeholder='Введите часть названия'
                onChange={(event) => {
                  let value = event.target.value;
                  this.setState({
                    sportzone: value,
                  });
                }}
                onBlur={(event) => {
                  this.applyFilter();
                }}
              />
            </div>
          </div>

          <div className='inputContainer'>
            <div className='label'>Тип спортивной зоны</div>
            <div className='inputWrapper'>
              <select
                onChange={(event) => {
                  let value = +event.target.value;
                  this.setState(
                    {
                      zonetypeId: value,
                    },
                    this.applyFilter
                  );
                }}
              >
                <option key={0} value={0}>
                  Все
                </option>
                {Object.keys(spr_zonetype).map((key) => (
                  <option key={key} value={key}>
                    {spr_zonetype[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='inputContainer'>
            <div className='label'>Вид спорта</div>
            <div className='inputWrapper'>
              <select
                onChange={(event) => {
                  let value = +event.target.value;
                  this.setState(
                    {
                      sportId: value,
                    },
                    this.applyFilter
                  );
                }}
              >
                <option key={0} value={0}>
                  Все
                </option>
                {Object.keys(spr_sport).map((key) => (
                  <option key={key} value={key}>
                    {spr_sport[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='inputContainer'>
            <div className='label'>Доступность</div>
            <div className='inputWrapper'>
              <select
                onChange={(event) => {
                  let value = +event.target.value;
                  this.setState(
                    {
                      affinityId: value,
                    },
                    this.applyFilter
                  );
                }}
              >
                <option key={0} value={0}>
                  Все
                </option>
                {Object.keys(spr_affiinity).map((key) => (
                  <option key={key} value={key}>
                    {spr_affiinity[key]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='inputContainer'>
            <button
              onClick={() => {
                this.emitter.emit('clearCircles');
              }}
            >
              Очистить круги доступности
            </button>
          </div>
          <div className='inputContainer'>
            <button
              onClick={() => {
                this.setState({
                  isPopulationLayer: !this.state.isPopulationLayer,
                });
              }}
            >
              {this.state.isPopulationLayer ? 'Убрать' : 'Показать'} плотность
              населения
            </button>
          </div>
          {/* <div className="inputContainer">
                        <button onClick={() => {}}>Ближайшие 10 объектов</button>
                    </div> */}
          <div className='info'>
            <div style={{ width: 200, float: 'left' }}>
              <div>Диапазоны площади объектов, кв.м.</div>
              {Array(15)
                .fill(0)
                .map((v, i) => {
                  const rgb1 = [255, 0, 0, 1] as IRGBA;
                  const rgb2 = [0, 255, 0, 1] as IRGBA;

                  let rgbStr = getInterjacentColorStr(i, 15, rgb1, rgb2);

                  return (
                    <>
                      <div key={i}>
                        <div
                          style={{
                            width: 30,
                            height: 20,
                            backgroundColor: rgbStr,
                            float: 'left',
                          }}
                        ></div>
                        <div style={{ float: 'left', paddingLeft: 5 }}>
                          {2 ** i - 1}
                          {i < 14 ? <>&ndash;{2 ** (i + 1) - 1}</> : <>+</>}
                        </div>
                      </div>
                      <div style={{ clear: 'both' }}></div>
                    </>
                  );
                })}
            </div>
            <div style={{ width: 200, float: 'left' }}>
              <div>Диапазоны плотности населения</div>
              {Array(20)
                .fill(0)
                .filter((v, i) => i % 2)
                .map((v, i) => {
                  const rgb1 = [0, 0, 255, 1] as IRGBA;
                  const rgb2 = [255, 0, 0, 1] as IRGBA;

                  let rgbStr = getInterjacentColorStr(i, 9, rgb1, rgb2);
                  return (
                    <>
                      <div key={i}>
                        <div
                          style={{
                            width: 30,
                            height: 20,
                            backgroundColor: rgbStr,
                            float: 'left',
                          }}
                        ></div>
                        <div style={{ float: 'left', paddingLeft: 5 }}>
                          {i * 10}
                          {i < 9 ? <>&ndash;{(i + 1) * 10}</> : <>+</>}
                        </div>
                      </div>
                      <div style={{ clear: 'both' }}></div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default App;
