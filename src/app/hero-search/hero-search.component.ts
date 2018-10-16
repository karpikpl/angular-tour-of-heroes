import { Component, OnInit } from '@angular/core';
import { Observable, Subject, fromEventPattern } from 'rxjs';

import {
  debounceTime, distinctUntilChanged, switchMap
} from 'rxjs/operators'

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {

  heroes$: Observable<Hero[]>;
  private searcherms = new Subject<string>();

  constructor(private heroService: HeroService) { }

  search(term: string) : void {
    this.searcherms.next(term);
  }

  ngOnInit() {
    this.heroes$ = this.searcherms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time term changes
      switchMap((term: string) => this.heroService.searchHeroes(term))
    )
  };

}
