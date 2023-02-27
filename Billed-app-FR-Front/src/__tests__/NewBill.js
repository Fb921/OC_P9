/**
 * @jest-environment jsdom
 */

import { screen,fireEvent } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import store from "../__mocks__/store.js"
// import {localStorageMock} from "../__mocks__/localStorage.js"


describe("Given I am connected as an employee", () => {
  describe("When I put a new file", () => {
    test("Then the file field should be updated", async () => {
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      window.localStorage.setItem('email', JSON.stringify({type: 'email@test.tld'}))

      let root = document.createElement("div");
      root.id="root";
      root.innerHTML = NewBillUI();
      document.body.appendChild(root);

      const onNavigate = jest.fn()
      const locStorage =  window.localStorage
      let newbill = new NewBill({document, onNavigate, store, locStorage})
      
      
      fireEvent.change(newbill.document.querySelector(`input[data-testid="file"]`), {})
      
      await newbill.fileUrl;
      await newbill.fileName;
      await newbill.billId;

      expect(newbill.fileUrl).not.toEqual(null);
      expect(newbill.fileName).not.toEqual(null);
      expect(newbill.billId).not.toEqual(null);
    })
  })
  describe("When I submit the new file form", () =>{
    test("Then the new bill should be added in the list of bills on the dashboard", async () => {
      window.localStorage.setItem('user', JSON.stringify({type: 'Employee'}))
      window.localStorage.setItem('email', JSON.stringify({type: 'email@test.tld'}))

      let root = document.createElement("div");
      root.id="root";
      root.innerHTML = NewBillUI();
      document.body.appendChild(root);

      let onNavigate = jest.fn()
      let locStorage =  window.localStorage

      let newbill = new NewBill({document,onNavigate, store, locStorage})
      newbill.updateBill = jest.fn()
      newbill.document.querySelector(`form[data-testid="form-new-bill"]`).submit()
      expect(newbill.updateBill).toHaveBeenCalled()
      expect(newbill.onNavigate).toHaveBeenCalled()

      // 2 façons de faire : On aurait pu aussi vérifier que la méthode updateBill nous renvoie bien le résultat attendu
    })
  })
})
