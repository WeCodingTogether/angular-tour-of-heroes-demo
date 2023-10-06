import { Component, OnInit } from '@angular/core';
import { Hero } from '../hero'
import { HeroService } from '../hero.service';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {
  // hero = 'Windstorm';
  // hero: Hero = {
  //   id: 1,
  //   name: 'Windstorm'
  // }

  // selectedHero?: Hero;
  heroes: Hero[] = [];
  // message: string = '';

  constructor(private heroService: HeroService) {}

  ngOnInit() {
    this.getMyHeroes();
  }

  // onSelect(hero: Hero) {
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroComponent: Selected hero is=${hero.id}`); //注意这里的反引号 不是单引号
  // }

  // Sync data getting
  // getMyHeroes() {
  //   this.heroes = this.heroService.getHeroes();
  // }

  // Async data getting( for api invoking)
  getMyHeroes() {
    this.heroService.getHeroes().subscribe(heroes => this.heroes = heroes);

  }
}
