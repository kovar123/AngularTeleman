import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input,OnInit, Output } from '@angular/core';
import { DxButtonGroupModule, DxRadioGroupModule } from 'devextreme-angular';
import { ItemClickEvent } from 'devextreme/ui/button_group';
import { ValueChangedEvent } from 'devextreme/ui/radio_group';



@Component({
  selector: 'app-my-lista',
  templateUrl: './my-lista.component.html',
  styleUrls: ['./my-lista.component.css'],
  imports: [CommonModule,DxRadioGroupModule,DxButtonGroupModule],
  standalone:true
})
export class MyListaComponent implements OnInit {
  @Input() lista:any[]=[];
  @Output() newItemEvent = new EventEmitter<number>();
 
itemClick(e: ItemClickEvent) {
  // notify({ message: `The "${e.itemData.text}" button was clicked`, width: 320 }, 'error', 1000);
  this.newItemEvent.emit(e.itemData.id);
  

}

 

  constructor() { }

  ngOnInit() { }


  onValueChanged=(e: ValueChangedEvent)=>{


  }

}

