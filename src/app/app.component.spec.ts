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

		describe('when the user clicks on the \'decreaseBtn\' element', () => {
			afterEach(() => {
				component.count = 0;
			});

      it('should call the expected action from the template', async () => {
        spyOn(component, 'decreaseCount')
          .and.callThrough();
        
        decreaseBtn.dispatchEvent(new Event('click'));
				fixture.detectChanges();
        await fixture.whenStable();
				textDiv = fixture.debugElement.query(By.css('div#mainTxt')).nativeElement;

				expect(component.decreaseCount).withContext('Method not called as expected').toHaveBeenCalled();
				expect(component.count).withContext('Value not equal 0 as expected').toBe(0);
				expect(textDiv).withContext('Text not rendered as expected').not.toBeNull();
				expect(textDiv?.textContent).withContext('Text not equal to the expected one').toContain('Number of clicks: 0');
      });
    });

		describe('when the user clicks on the \'increaseBtn\' element', () => {
			afterEach(() => {
				component.count = 0;
			});

			it('should call the expected action from the template', async () => {
        spyOn(component, 'increaseCount')
          .and.callThrough();
        
        increaseBtn.dispatchEvent(new Event('click'));
				fixture.detectChanges();
        await fixture.whenStable();
				textDiv = fixture.debugElement.query(By.css('div#mainTxt')).nativeElement;

				expect(component.increaseCount).withContext('Method not called as expected').toHaveBeenCalled();
				expect(component.count).withContext('Value not equal 1 as expected').toBe(1);
				expect(textDiv).withContext('Text not rendered as expected').not.toBeNull();
				expect(textDiv?.textContent).withContext('Text not equal to the expected one').toContain('Number of clicks: 1');
      });
		});

		describe('when the user clicks on the buttons several times', () => {
			afterEach(() => {
				component.count = 0;
			});

			it('should render the number of clicks based on the count variable', async () => {
				let increaseAttempt: number = 4;
				let decreaseAttempts: number = 3;

				for (let i = 1; i <= increaseAttempt; i++) {
					increaseBtn.dispatchEvent(new Event('click'));
					fixture.detectChanges();
					await fixture.whenStable();
					textDiv = fixture.debugElement.query(By.css('div#mainTxt')).nativeElement;
	
					expect(component.count).withContext(`Value not equal ${i} as expected`).toBe(i);
					expect(textDiv).withContext('Text not rendered as expected').not.toBeNull();
					expect(textDiv?.textContent).withContext('Text not equal to the expected one').toContain(`Number of clicks: ${i}`);
				}
				
				for (let i = 1; i < decreaseAttempts; i++) {
					decreaseBtn.dispatchEvent(new Event('click'));
					fixture.detectChanges();
					await fixture.whenStable();
					textDiv = fixture.debugElement.query(By.css('div#mainTxt')).nativeElement;

					expect(component.count).withContext(`Value not equal ${increaseAttempt-i} as expected`).toBe(increaseAttempt-i);
					expect(textDiv).withContext('Text not rendered as expected').not.toBeNull();
					expect(textDiv?.textContent).withContext('Text not equal to the expected one').toContain(`Number of clicks: ${increaseAttempt-i}`);
				}
			});
		});
	});
});
