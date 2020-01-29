import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Planet} from './app.component';

@Component({
  selector: 'planet',
  template: `<h1>Planet {{planet?.name}}!</h1>
  
    <button type="button" (click)="deletePlanet()">Delete</button>
  `,
  styles: [`h1 { font-family: Lato; }`]
})
export class HelloComponent  {
  @Input() planet: Planet;

  @Output() onDeletePLanet = new EventEmitter<any>();


  public deletePlanet(){
    window.alert(`You clicked on this planet ${this.planet.name}`);
    this.onDeletePLanet.emit(true);
  }
  
}
