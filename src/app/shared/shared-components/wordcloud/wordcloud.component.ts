import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

import { TrendingWord } from '../../../email-analytics/interfaces/dashboard';
import { WordCloudItem } from '../../types';

declare var $: any;

@Component({
  selector: 'app-wordcloud',
  templateUrl: './wordcloud.component.html',
  styleUrl: './wordcloud.component.scss'
})
export class WordcloudComponent implements OnInit {
  @Input() title!: string;
  @Input() isLoading!: boolean;
  //@Input("words") wordList!: WordCloudItem[];
  @Input() words!: WordCloudItem[];

  ngOnInit() {

  }

  refreshChart(wordList: WordCloudItem[]) {
    console.log("started refresh", wordList)
    $("#wordCloud").jQWCloud({
      words: wordList,
      maxFont: 50,
      minFont:10,
      verticalEnabled: true,
      padding_left: null,
      word_click :function(event: any){
        console.log(event.target.textContent);
      },
      word_mouseOver :function(){},
      word_mouseEnter :function(){},
      word_mouseOut :function(){},
      beforeCloudRender:function(){},
      afterCloudRender:function(){}
    });

    console.log("finished refresh", wordList)
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['words'] ) {
      console.log("change in words in wordcloud detected")
      this.sleep(2000).then(() => { // Sleep for 2000 milliseconds (2 seconds)
        this.refreshChart(this.words);
    });
    }
  }

  sleep(milliseconds: number) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  }
}
