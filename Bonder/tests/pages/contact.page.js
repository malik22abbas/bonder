const {
    expect
} = require('@playwright/test');
const assert = require('assert');
require('dotenv').config();

class ContactsPage {
    constructor(page) {
        this.page = page;
    }

    async clickNewContact() {
        await this.page.waitForSelector('button.button.button--primary:has-text("New contact")');
        await this.page.click('button.button.button--primary:has-text("New contact")');
    }

    async setFirstName(firstName) {
        await this.page.fill('input[name="first_name"]', firstName);
    }

    async setLastName(lastName) {
        await this.page.fill('input[name="last_name"]', lastName);
    }

    async setCustomerNumber(customerNumber) {
        await this.page.fill('input[name="customerNumber"]', customerNumber);
    }

    async setEmail(email) {
        await this.page.fill('input[name="email"]', email);
    }

    async setContactNumber(contactNumber) {
        const vueTelInputElement = await this.page.waitForSelector('div.vue-tel-input');
        const inputElement = await vueTelInputElement.$('input.vti__input');
        await inputElement.fill(contactNumber);

    }

    async clickCreate() {
        await this.page.click('//*[@id="dropdown-selected-item-button"]');
    }

    async verifyValidationError(errorText) {

        await this.page.waitForSelector('span.validation--error[name="phone"]');
        const errorElement = await this.page.$('span.validation--error[name="phone"]');
        const error = await errorElement.innerText();
        expect(error).toBe(errorText);
    }

    async verifySlideOverData(firstName, lastName, email, customerNumber) {
        const preFilledFirstName = await this.page.$eval('input[name="first_name"]', (input) => input.value);
        const preFilledLastName = await this.page.$eval('input[name="last_name"]', (input) => input.value);
        const preFilledEmail = await this.page.$eval('input[name="email"]', (input) => input.value);
        const preFilledCustomerNumber = await this.page.$eval('input[name="customerNumber"]', (input) => input.value);

        console.log('Pre-filled First Name:', preFilledFirstName);
        console.log('Pre-filled Last Name:', preFilledLastName);
        console.log('Pre-filled Email:', preFilledEmail);
        console.log('Pre-filled Customer Number:', preFilledCustomerNumber);


        // const roles = await this.page.$('.roles-mini-card').innerText();
        // expect(roles).toContain("CUSTOMERS");
    }

    async clickSave() {
        const saveButton = this.page.getByRole('button', {
            name: 'Save'
        });
        await saveButton.click();
    }


    async verifySlideOverClosed() {
        const slideOver = await this.page.$('.slide-over'); // Update selector
        expect(slideOver).toBeNull();
    }

    // Additional method to verify the new contact in the list can be added here.

    async verifyNewContactAdded(firstName){
        const verifyContact = '//*[@id="UsersCell-UserAddresses.Country-82b84172-8b20-40a4-b007-2c37068d7e36"]' ;
        await this.page.waitForSelector(verifyContact);
        const verifyName = await this.page.$eval(verifyContact, (cell) => cell.textContent);

        if (verifyName.trim() === firstName) {
            console.log('First name matches the saved name.');
        } else {
            console.log('First name does not match the saved name.');
        }
    }

    async openContactToEdit(){ 
        await new Promise(resolve => setTimeout(resolve, 5000));

    //    await this.page.waitForSelector('//*[@id="UsersCell-UserAddresses.Country-82b84172-8b20-40a4-b007-2c37068d7e36"]');
    //    const element = await this.page.$('//*[@id="UsersCell-UserAddresses.Country-82b84172-8b20-40a4-b007-2c37068d7e36"]'); // Replace with your selector
    //    await element.click();
       await this.page.getByRole('link', { name: 'Ab1581' }).click();
  
        // Wait for the slider to appear (adjust the timeout as needed)
    //    await this.page.waitForSelector('//*[@id="sendNewPasswordEmail"]', { timeout: 10000 });
    }

    async addStreet(street){
        await this.page.fill('input[name="street"]', street);
    }

    async addHousenumber(hnumber){
        await this.page.fill('input[name="housenr"]', hnumber);
    }

    async addCity(city){
        await this.page.fill('input[name="city"]', city);
    }

    async addPostalcode(postalCode){
        await this.page.fill('input[name="zip"]', postalCode);
    }

    async addNotes(notes){
        await this.page.waitForSelector('textarea[name="note"]', { timeout: 10000 });
        await this.page.fill('textarea[name="note"]', notes);
    }    

    async typeContactToSearch(){
        await this.page.fill('//*[@id="UsersSearchPhraseTextBox"]', 'test');
    }

    async verifyContactAppeared(){
        await new Promise(resolve => setTimeout(resolve, 5000));
        const linkSelector = 'a#UsersCell-firstName-8d8edd50-a4cd-4556-a766-1370525b6f31';

        // Extract the text content of the <a> element
        const linkText = await this.page.$eval(linkSelector, link => link.textContent);

        // Perform an assertion on the extracted text
        assert.strictEqual(linkText, 'Test', 'Text does not match expected value.');
    }

    async applyFilter(){
        await this.page.getByRole('cell', { name: 'created at' }).click();
    }

    async clearSearch(){
        await this.page.fill('//*[@id="UsersSearchPhraseTextBox"]', '');
    }

    async verifyFilterCleared(){
        await new Promise(resolve => setTimeout(resolve, 5000));
        const linkSelector = '//*[@id="UsersCell-firstName-7712009d-2e67-4b08-bbc4-0244f9c41eab"]';

        // Extract the text content of the <a> element
        const linkText = await this.page.$eval(linkSelector, link => link.textContent);

        // Perform an assertion on the extracted text
        assert.strictEqual(linkText, 'Ab1581', 'Text does not match expected value.');
    }
    
}

module.exports = {
    ContactsPage,
};