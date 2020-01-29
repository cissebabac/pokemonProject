import { Component,  OnInit } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable, BehaviorSubject, combineLatest} from 'rxjs';

import { map, debounceTime } from 'rxjs/operators';

import { flatten, uniq } from 'underscore';

const API = 'https://pokeapi/api/v2/pokemon/ditto/'

export interface Planet {
    "name": string,
    "rotation_period": string,
    "orbital_period": string,
    "diameter": string,
    "climate": string,
    "gravity": string,
    "terrain": string,
    "surface_water": string,
    "population": string,
    "residents": string[],
    "films": string[],
    "created": string,
    "edited": string,
    "url": string
	}

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent implements OnInit {
  name = 'Angular';

  searchString: string;
  search$ = new BehaviorSubject<string>(null);

  planets$: Observable<Planet[]>;
  terrains$: Observable<string[]>;

  selectedTerrain$ = new BehaviorSubject<string>(null);
  filteredPlanets$: Observable<Planet[]>;

  constructor(
    private http: HttpClient,
  ) {}


  ngOnInit() {
    this.planets$ = this.http.get<any>(`${API}/planets`).pipe(
      map(response => {
        return response.results;
      })
    );

    this.terrains$ = this.planets$.pipe(
      map(planets => {
        return planets.map(
          planet => planet.terrain
        )
      }),
      map(terrains => {
        return flatten(terrains.map(terrain => terrain.split(',')))
      }),
      map(
        terrains => terrains.map(terrain => terrain.trim())
      ),
      map(
        terrains => {
          return terrains.map((terrain: string) => {
            if (terrain.endsWith('s')) {
              return terrain.slice(0, -1);
            }
            return terrain;
          })
        }
      ),
      map(
        terrains => uniq(terrains)
      ),
    );


    this.filteredPlanets$ = combineLatest(this.planets$, this.selectedTerrain$, this.search$.pipe(debounceTime(100)), (planets, selectedTerrain, searchString) => {
      return planets.filter(planet => {
        if (!selectedTerrain) {
          return true;
        }
        return planet.terrain.includes(selectedTerrain);
      }).filter(
        planet => {
          if (!searchString) {
            return true;
          }
          return planet.name.includes(searchString);
        }
      );
    })
    


  }


  public onSelectTerrain(terrain : string) {
    // window.alert('🔥 ' + terrain);
    this.selectedTerrain$.next(terrain);
  }

  
  public getEmojiString(index: number): string {
    return `&#12940${index};`;
  }

  public triggerSearchChange(event: any) {
    console.log('😂', event);
    this.search$.next(event);
  }

  public logger(event: any) {
    console.log('logger says', event);
  }
  
}
