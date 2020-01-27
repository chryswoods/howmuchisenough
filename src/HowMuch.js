import React from 'react';

import NumericInput from 'react-numeric-input';
import Select from 'react-select';

import styles from './HowMuch.module.css';

import power from './power.json';
import homes from './homes.json';

function round(value, places=2){
  return Number(Math.round(parseFloat(value + 'e' + places))
                 + 'e-' + places).toFixed(places);
}

class HowMuch extends React.Component {
  constructor(props){
    super(props);

    this.state = {computer: "Blue Crystal v4",
                  place: "United Kingdom",
                  pue: 1.2,
                  count: 1.0,
                  time: 0,
                  percent: 100,
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

  slotChangePercent(value){
    if (value < 0.1){
      value = 0.1;
    }
    else if (value > 100){
      value = 100;
    }

    this.setState({"percent": value});
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

  getComputer(){
    return power[this.state.computer];
  }

  getPlace(){
    return homes[this.state.place];
  }

  getPlacePower(){
    let kWhYear = this.getPlace();
    return kWhYear / (365*24);
  }

  calculatePower(){
    let computer = this.getComputer();

    let p = this.state.percent * computer.power / 100.0;

    return p * this.state.pue;
  }

  calculateKW(){
    let p = this.calculatePower();

    let unit = "kilowatt";

    if (p > 1000){
      p /= 1000;
      unit = "megawatt";
    }

    let s = "s";

    if (p === 1.0){
      s = "";
    }

    return `${round(p,3)} ${unit}${s}`;
  }

  calculateNumHomes(){
    let num_homes = this.calculatePower() / this.getPlacePower();

    return `${round(num_homes, 0)} homes`;
  }

  calculateDomestic(){
    let time = this.state.times[this.state.time][1] * this.state.count;
    let kWh = this.calculatePower() * time;

    time = kWh / this.getPlacePower();

    let unit = "hour";
    let s = "s";

    if (time > (365*24)){
      time /= (365*24);
      unit = "year";
    }
    else if (time > (30*24)){
      time /= (30*24);
      unit = "month";
    }
    else if (time > (7*24)){
      time /= (7*24);
      unit = "week";
    }
    else if (time > 24){
      time /= 24;
      unit = "day";
    }

    time = round(time, 1);

    if (time === "1.0"){
      s = "";
    }

    return `${time} ${unit}${s}`;
  }

  placeHasThe(){
    let p = this.state.place;

    if (p.startsWith("United")){
      return true;
    }
    else if (["Netherlands", "European Union", "World"].indexOf(p) >= 0){
      return true
    }

    return false;
  }

  render(){
    let s = "s";

    if (this.state.count === 1.0){
      s = "";
    }

    let the = "";

    if (this.placeHasThe()){
      the = "the";
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

    let kwatt = this.calculateKW();
    let numhomes = this.calculateNumHomes();
    let domestic = this.calculateDomestic();

    let power_type = "reported";
    let estimated = "";
    let disclaimer = "";
    if (this.getComputer().is_calculated){
      estimated = "(*)";
      power_type = "estimated";
      disclaimer = <div className={styles.disclaimer}>
                     (*) the power consumption of this supercomputer is estimated
                     based on its reported Rmax and the average GFLOPs/Watt
                     calculated from reporting supercomputers that year.
                   </div>;
    }

    return <div className={styles.container}>
             <div>
              Using
              <NumericInput min={0.1} max={100.0} value={this.state.percent}
                            step={5}
                            onChange={(value)=>{this.slotChangePercent(value)}}/>% of&nbsp;
              <Select options={computers}
                      value={computer}
                      onChange={(item)=>{this.slotSelectComputer(item.value);}}/>&nbsp;
              assuming a PUE of&nbsp;
              <NumericInput min={1.0} max={2.0} value={this.state.pue}
                            step={0.1}
                            onChange={(value)=>{this.slotChangePUE(value)}}/>&nbsp;
              will burn electricity at a rate of&nbsp;
              <span className={styles.result}>
                {kwatt}
              </span>.
             </div>
             <div>
               Compared to the average domestic electricity consumption in {the}&nbsp;
               <Select options={places}
                       value={place}
                       onChange={(item)=>{this.slotSelectPlace(item.value);}}/>,&nbsp;
               this is the same as powering&nbsp;
               <span className={styles.result}>
                 {numhomes}
               </span>.
             </div>
             <div>
               The electricity consumed to run a job for&nbsp;
               <NumericInput min={0.0} max={100.0} value={this.state.count}
                                step={1}
                                onChange={(value)=>{this.slotChangeCount(value)}}/>
               <Select options={times}
                      value={time}
                      onChange={(item)=>{this.slotChangeTime(item.value);}}/>&nbsp;
               would power an average
               home in {the} {this.state.place} for&nbsp;
               <span className={styles.result}>{domestic}</span>.
             </div>
             <div className={styles.explainer}>
               This is based on the {power_type} power consumption of {this.state.computer}&nbsp;
               being {this.getComputer().power} kW{estimated},
               and the total power consumption of the average home
               in {the} {this.state.place} being {this.getPlace()} kWh per year.
             </div>
             <div>
               This computer has a Rmax speed of {this.getComputer().tflops} TFLOPs,
               meaning its efficiency is {power_type} to
               be {this.getComputer().tflops / this.getComputer().power} GFLOPs/watt.
             </div>
             {disclaimer}
             <div className={styles.sources}>
               <ul>
                 <li>Supercomputer power information taken from the&nbsp;
                     <a href="https://top500.org">Top500</a></li>
                 <li>Average domestic power consumption in 2014 taken from&nbsp;
                     <a href="https://www.wec-indicators.enerdata.eu/household-electricity-use.html">
                       World Energy Forum figures
                     </a>
                 </li>
                 <li>Average domestic energy consumption in UK in 2019 taken from&nbsp;
                     <a href="https://www.ovoenergy.com/guides/energy-guides/how-much-electricity-does-a-home-use.html">
                       OVO Energy guides
                     </a>
                 </li>
               </ul>
             </div>
           </div>;
  }
};

export default HowMuch;
