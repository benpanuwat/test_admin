import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class AppService {

    //public server="https://dropy.co.th/api/server";
    public server="http://localhost/dropy/server";

  constructor() { }

}
