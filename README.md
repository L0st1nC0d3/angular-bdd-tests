# angular-bdd-tests
In this repo I try to test and give an overview of testing the components by a BDD approach

# BDD Testing
---

**BDD** (Behaviour Driven Development) is a way to write software tests in order to be driven by the behaviour that the software
is expected to have instead of the test itself.

It's important to note that the goal of the two major test paradigms (TDD and BDD) is to bring high quality into our code.

Let's focus on the BDD in the Angular (Jasmine) applications.

## Jasmine BDD Framework
---

Jasmine is a popular BDD Javascript framework.
It's used together with Angular framework as a test framework, to test some functionalities.

```
describe('Name of the test suite', () => {});
```

We can *describe* some test suites or cases by the previous expression, and put a callback function with some arrange or teardown
functions and with all the cases related to a specific action.

We can have a deep / nested structure of tests:

```
describe('The main component suite', () => {
	// some teardown or arrange functions

	it('should assert something', () => {});
	
	// another suite related to a specific case
	describe('when somethig happens', () => {
		// some teardown or arrange functions
		
		it('should affect the state in some way', () => {});
	});
	
	// another suite related to another case
	describe('when somethig else happens', () => {
		// some teardown or arrange functions
		
		it('should affect the state in another way', () => {});
	});
});
```

As you can see, this nested structure gives us the chance to put all the logic related to a subset of tests in one place, reusing it.

## Some practice
---

Let's try to test a simple Angular component:

**app.component.ts**

```
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
	count: number;

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
```

It's a simple component that displays a text with the number of clicks on two buttons, to increase or decrease that number.
We can think about different scenarios that can happen:

- the user lands on the page for the first time and see the rendered component
- the user clicks on the decrease button and nothing changes
- the user clicks on the increase button and the count is updated by 1
- the user clicks on the decrease button and the count is updated and returns to 0
- the user clicks on the increase button several times and the count is updated
- the user clicks on the decrease button several times and the count is decreased until 2
- the user clicks on the decrease button several times and the count is decreased until 1 (no less because it's already been tested)

These cases could be translated in a set of tests, keeping in mind to divide what actions makes the application state change:

1. if the user lands on the page, than the only thing to test is the rendered component
	1a. we have to check that the expected text and elements are displayed in the DOM
2. if the user clicks on the *decrease* button
	2a. the function *decreaseCount* has to be called (maybe check the call with a spy or mock)
	2b. the value that is displayed is 0 because in the component logic a negative value is not allowed
	2c. we can finally check that the final rendered text contains exactly 0 as number
3. if the user clicks on the *increase* button
	3a. the function *increaseCount* has to be called (maybe check the call with a spy or mock)
	3b. the value that is displayed is 1 because the count has been increased by 1
	3c. we can finally check that the final rendered text contains exactly 1 as number
	3d. if the user clicks again the *decrease* button than the state changes again
		3da. the expected function has to be called
		3db. the expected value must be shown
		
As you can see, it could be tricky to write all the tests and cases even for a small and simple component as this one,
so it's important to decide in which order to proceed and then what to check at each step.

### Incapsulate everything into the rendering function of the component
---

In order to understand how to write the tests structure, we have t keep in mind how the rendering process of the Angular components
work:

1. the component is created using the TestBed
2. we generate the component fixture with the component context
3. the method **fixture.detectChanges()** is called and than the invocation to the method *ngOnInit* is triggered
4. the UI is rendered

These points are all described in the following lines of code:

```
let component: AppComponent;
let fixture: ComponentFixture<AppComponent>;

// the component is configured here
beforeEach(async () => {
	await TestBed.configureTestingModule({
	  declarations: [
		AppComponent        
	  ],
	  imports: [],
	  providers: [],
	}).compileComponents();
});

beforeEach(() => {
	// component fixture is created here
	fixture = TestBed.createComponent(CredentialRecoveryComponent);
	component = fixture.componentInstance;
	
	// the UI change detection an ngOnInit call is triggered here
	fixture.detectChanges();
});
```

so we can put this logic in the upper level of our suite, by doing this:

**app.component.spec.ts**

```
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
	let component: AppComponent;
	let fixture: ComponentFixture<AppComponent>;

	// the component is configured here
	beforeEach(async () => {
		await TestBed.configureTestingModule({
		  declarations: [
			  AppComponent
		  ],
		  imports: [],
		  providers: [],
		}).compileComponents();
	});

	beforeEach(() => {
		// component fixture is created here
		fixture = TestBed.createComponent(AppComponent);
		component = fixture.componentInstance;
		
		// the UI change detection an ngOnInit call is triggered here
		fixture.detectChanges();
	});
	
	it('should set the count value to 0', () => {
		expect(component.count).withContext('Count value not initialized as expected').toBe(0);
	});

	describe('template rendered', () => {
		let textDiv: HTMLElement;
		let increaseBtn: HTMLElement;
		let decreaseBtn: HTMLElement;
		
		beforeEach(() => {
			textDiv = fixture.debugElement.query(By.css('div#mainTxt')).nativeElement;
			increaseBtn = fixture.debugElement.query(By.css('button#increaseBtn')).nativeElement;
			decreaseBtn = fixture.debugElement.query(By.css('button#decreaseBtn')).nativeElement;
		});
		
		it('should render the expected elements', () => {
			expect(textDiv).withContext('Text element not rendered').not.toBeNull();
			expect(increaseBtn).withContext('Increase button not rendered').not.toBeNull();
			expect(decreaseBtn).withContext('Decrease button not rendered').not.toBeNull();
		});
		
		it('should show the text with count 0', () => {
			expect(textDiv?.textContent).withContext('Text not equal to the expected one').toContain('Number of clicks: 0');
		});
		
		it('should show the text \'Increase\' into the right button', () => {
			expect(increaseBtn?.textContent).withContext('The text is not the expected one').toContain('Increase');
		});
		
		it('should show the text \'Decrease\' into the right button', () => {
			expect(decreaseBtn?.textContent).withContext('The text is not the expected one').toContain('Decrease');
		});
	});
});
```

This is just an example of how to structure the first BDD tests, by put the ones about the init of the state at the top, and after them
we start to check the rendered elements, and their properties such as the text.
The set of tests written until now ensures that the component is created and initialized with the variable *count* set to 0 and the
rendered HTML elements are found in the DOM (using the **fixture.debugElement** object and then query by the css selectors) with the expected text.

Let's then continue the test suite by adding some tests under the 'template rendered' one, since that these cases will happen after the rendering of the components and the relative elements:

**app.component.spec.ts** (partial)

```
describe('template rendered', () => {
		let textDiv: HTMLElement;
		let increaseBtn: HTMLElement;
		let decreaseBtn: HTMLElement;
		
		beforeEach(() => {
			textDiv = fixture.debugElement.query(By.css('div#mainTxt')).nativeElement;
			increaseBtn = fixture.debugElement.query(By.css('button#increaseBtn')).nativeElement;
			decreaseBtn = fixture.debugElement.query(By.css('button#decreaseBtn')).nativeElement;
		});
		
		it('should render the expected elements', () => {
			expect(textDiv).withContext('Text element not rendered').not.toBeNull();
			expect(increaseBtn).withContext('Increase button not rendered').not.toBeNull();
			expect(decreaseBtn).withContext('Decrease button not rendered').not.toBeNull();
		});
		
		it('should show the text with count 0', () => {
			expect(textDiv?.textContent).withContext('Text not equal to the expected one').toContain('Number of clicks: 0');
		});
		
		it('should show the text \'Increase\' into the right button', () => {
			expect(increaseBtn?.textContent).withContext('The text is not the expected one').toContain('Increase');
		});
		
		it('should show the text \'Decrease\' into the right button', () => {
			expect(decreaseBtn?.textContent).withContext('The text is not the expected one').toContain('Decrease');
		});
    
    // Here the new tests
    describe('when the user clicks on the \'decreaseBtn\' element', () => {
      it('should call the expected action from the template', () => {
        spyOn(component, 'decreaseCount')
          .and.callThrough();
        
        decreaseBtn.dispatchEvent(new Event('click'));
        fixture.whenStable().then(() => {
          expect(component.decreaseCount).withContext('Method not called as expected').toHaveBeenCalled();
          expect(component.count).withContext('Value not equal 0 as expected').toBe(0);
        });
      });;
    });
	});
});
```
