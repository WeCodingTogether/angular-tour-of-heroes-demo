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

  add(name: string): void {
    name = name.trim(); // no space
    if(!name) { return;} // if name is null, return
    this.heroService.addHero({ name } as Hero)  // {name}将string类型的name转换为obj，as Hero是一个类型断言,TypeScript会将前面的obj视为Hero类型
                    .subscribe(hero => this.heroes.push(hero));
  }

  delete(hero: Hero): void {
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}
