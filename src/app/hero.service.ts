import { Injectable } from '@angular/core';
import { Hero } from './hero'
import { HEROES } from './mock-heroes'
import { Observable, of } from 'rxjs'
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  // 这里的heroes根据InMemoryDataService里返回的{heroes}对象匹配查找
  private heroesUrl = "api/heroes";

  constructor(
    private messageService: MessageService,
    private http: HttpClient
  ) { }

  // 1 Sync data getting
  // getHeroes(): Hero[] {
  //   return HEROES;
  // }

  // 2 Async data getting
  // getHeroes(): Observable<Hero[]> {
  //   const heroes = of(HEROES);
  //   this.messageService.add('HeroService: fetched heroes');
  //   return heroes;
  // }

   // 3 Use HttpClient getting data
   // http.get() 返回 Obaservable<T>对象
   getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
            .pipe(
              tap(_ => this.log('fetched heroes')),  // 下划线 _ 通常用作一个占位符，表示一个变量或参数是存在的，但它的值在这个上下文中不被使用或不重要。
              catchError(this.handleError<Hero[]>('getHeroes', []))
            );
   }

  // 1 Async hero data getting
  // getHero(id: number): Observable<Hero> {
  //   const hero = HEROES.find(h => h.id === id)!;
  //   this.messageService.add(`HeroService: fetched hero id=${hero.id}`);
  //   return of(hero);
  // }

  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
            .pipe(
              tap(_ => this.log(`fetched hero id=${id}`)),
              catchError(this.handleError<Hero>(`getHero id=${id}`))


            );
  }

  
  // 包装message方法
  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }


  /**
   *handle http opration that failed
   *
   * @param operation name of operation(method) that failed
   * @param result optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }

}
