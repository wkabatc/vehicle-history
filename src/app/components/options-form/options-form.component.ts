import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'options-form',
  templateUrl: './options-form.component.html',
  styleUrls: ['./options-form.component.css']
})
export class OptionsFormComponent implements OnInit {
  //selected = 'option1';
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Input() selectedOption: string = '';

  constructor() {}

  ngOnInit(): void {}
}
