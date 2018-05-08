import { Component, Output, EventEmitter } from '@angular/core';

import { Search } from '../../../models/search.model';
import { Data } from '../../../data/data.service';
import { EventService } from '../../../data/event.service';

@Component({
  selector: 'search',
  templateUrl: './search.component.html',
  styleUrls: ['../../../css/common.styles.css', './search.component.css']
})
export class SearchComponent{
  search: Search;
  searchResult: Array<{}>;  
  @Output() sendFirmsInfoToHome = new EventEmitter<Array<{}>>();

  constructor(private dataBase: Data, private eventService: EventService){
    this.search = new Search(); 
  }

  onSubmit(searchForm){ 
    searchForm = this.search;
    console.log(this.search); 
    this.dataBase
      .search(this.search)
      .subscribe(data => {
        this.searchResult = data.response;
        this.sendFirmsInfoToHome.emit(this.searchResult);
        if(this.searchResult.length){
          this.eventService.triggerNotificationFetched(data.message, data.success);
        }else{
          this.eventService.triggerNotificationFetched('Nothing found!', false);
        }        
      });
  }
}