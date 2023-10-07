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
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'applicatio/json'})
  };

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
   * handle http opration that failed
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

  /**
   * 使用HTTP客户端库（例如Angular的HttpClient）来执行PUT请求，将数据发送到上一步构建的URL。
   * 在这里，上一步构建的Url有具体的id： const url = `${this.heroesUrl}/${id}`;
   * 根据 id 修改相应的内容
   *
   * tap操作没有改变响应的类型，http.put() 后不需要显式指定响应类型，httpClient会推断响应类型
   *
   * @param hero 需要修改的内容
   */
  updateHero(hero: Hero): Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
                    .pipe(
                      tap(_ => this.log(`updated hero id=${hero.id}`)),
                      catchError(this.handleError<any>('updateHero'))
                    );
  }


  /**
   * 这里因为 tap操作尝试改变响应的类型为newHero: Hero, 所以需要在post方法上显式指定响应类型 http.post<Hero>()
   * @param hero 需要添加的内容
   * @returns 包含单个新添加的hero的Observable<Hero>
   */
  addHero(hero: Hero): Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
                    .pipe(
                      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)), // "w/" 是 "with" 的缩写
                      catchError(this.handleError<Hero>('addHero'))
                    );
  }

  deleteHero(id: number): Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.delete<Hero>(url, this.httpOptions)
                    .pipe(
                      tap(_ => this.log(`delete hero id=${id}`)),
                      catchError(this.handleError<Hero>('deleteHero'))
                    );
  }
}
