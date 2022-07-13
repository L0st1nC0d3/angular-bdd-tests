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
