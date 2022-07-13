import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'my-app',
	template: `
		<div id="mainTxt">Number of clicks: {{ count }}</div>
		<button id="increaseBtn" (click)="increaseCount()">Increase</button>
		<button id="decreaseBtn" (click)="decreaseCount()">Decrease</button>
	`,
	styles: []
})
export class AppComponent implements OnInit {
	count!: number;

	constructor() {}
	
	ngOnInit(): void {
		this.count = 0;
	}
	
	increaseCount(): void {
		this.count += 1;
	}
	
	decreaseCount(): void {
		this.count = this.count > 0 ? this.count -= 1 : 0;
	}
}
