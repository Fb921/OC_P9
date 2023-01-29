/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import mockedBills from "../__mocks__/store.js";

import router from "../app/Router.js";

// To test Bills.js
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression
      // expect(windowIcon.classList[0]).toEqual("active-icon");
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then bills should appear", async function () {
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      document.getElementById('root').innerHTML = BillsUI({ data: bills })
      let datas;
      const store = mockedBills
      const onNavigate = jest.fn()
      let b = new Bills({document, onNavigate, store, localStorageMock});
      expect(b.getBills().then(data => {datas = data})).toEqual(mockedBills.bills().list());      
    })
  })
  describe("When I click on icon eye", () => {
    test("Then bill details should appear", async () => {
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      document.getElementById('root').innerHTML = BillsUI({ data: bills })
      

      // génère une erreur car "modal" non  (jquery) considérée comme fonction
      document.querySelector(`div[data-testid="icon-eye"]`).click();
      // expect(docusment.querySelector('#modaleFile').classList[2]).toEqual("show");

    })
  })

})
