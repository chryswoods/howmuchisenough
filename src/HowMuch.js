import React from 'react';

import NumericInput from 'react-numeric-input';
import Select from 'react-select';

import styles from './HowMuch.module.css';

import power from './power.json';
import homes from './homes.json';

class HowMuch extends React.Component {
  constructor(props){
    super(props);

    this.state = {computer: null,
                  place: null,
                  pue: 1.2,
                  count: 1.0,
                  time: 0,
                  times: [["hour", 1],
                          ["day", 24],
                          ["week", 24*7],
                          ["month", 24*30],
                          ["year", 24*365]],
                 };
  }

  slotSelectComputer(item){
    this.setState({"computer": item});
  }

  slotSelectPlace(item){
    this.setState({"place": item});
  }

  slotChangePUE(value){
    if (value < 1.0){
      value = 1.0;
    }
    else if (value > 2.0){
      value = 2.0;
    }

    this.setState({"pue": value});
  }

  slotChangeCount(value){
    if (value < 0.1){
      value = 0.1;
    }
    else if (value > 100){
      value = 100;
    }

    this.setState({"count": value});
  }

  slotChangeTime(value){
    if (value < 0){
      value = 0;
    }
    else if (value >= this.state.times.count){
      value = this.state.times.count - 1;
    }

    this.setState({"time": value});
  }

  render(){
    let s = "s";

    if (this.state.count === 1.0){
      s = "";
    }

    let time = null;
    let times = [];
    for (let i=0; i<this.state.times.length; ++i){
      times.push({value:i, label:`${this.state.times[i][0]}${s}`});

      if (this.state.time === i){
        time = times[i];
      }
    }

    let place = null;
    let places = [];
    let keys = Object.keys(homes);
    keys.sort();

    for (let i=0; i<keys.length; ++i){
      places.push({value:keys[i], label:keys[i]});

      if (this.state.place === keys[i]){
        place = places[i];
      }
    }

    let computer = null;
    let computers = [];
    keys = Object.keys(power);
    keys.sort();

    for (let i=0; i<keys.length; ++i){
      computers.push({value:keys[i], label:keys[i]});

      if (this.state.computer === keys[i]){
        computer = computers[i];
      }
    }

    return <div className={styles.container}>
             <div className={styles.inputContainer}>
               Using

               Computer
               <Select options={computers}
                       value={computer}
                       onChange={(item)=>{this.slotSelectComputer(item.value);}}/>
               Home
               <Select options={places}
                       value={place}
                       onChange={(item)=>{this.slotSelectPlace(item.value);}}/>
               PUE
               <NumericInput min={1.0} max={2.0} value={this.state.pue}
                             step={0.1}
                             onChange={(value)=>{this.slotChangePUE(value)}}
                             snap/>
               TIME
               <NumericInput min={0.0} max={100.0} value={this.state.count}
                             step={1}
                             onChange={(value)=>{this.slotChangeCount(value)}}
                             snap/>
               TYPE
               <Select options={times}
                       value={time}
                       onChange={(item)=>{this.slotChangeTime(item.value);}}/>
             </div>
             <div className={styles.outputContainer}>
               Selected {this.state.computer} and {this.state.place}&nbsp;
               for {this.state.count} {this.state.times[this.state.time][0]}{s}&nbsp;
               assuming a PUE
               of {this.state.pue}
             </div>
           </div>;
  }
};

export default HowMuch;
