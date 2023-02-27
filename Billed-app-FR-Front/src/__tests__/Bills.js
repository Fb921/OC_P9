/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";
import storeMock from "../__mocks__/store.js";
import { formatDate, formatStatus } from "../app/format.js"

import router from "../app/Router.js";

// To test Bills.js
import Bills from "../containers/Bills.js";

import $ from "jquery"
import modal from "jquery-modal"

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
      expect(windowIcon.classList[0]).toEqual("active-icon");
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("Then all bills should appear in the correct date format", async function () {
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      document.getElementById('root').innerHTML = BillsUI({ data: bills })
      let datas1 = [];
      var datas2 = [];
      const store = storeMock;
      const onNavigate = jest.fn()
      let b = new Bills({document,onNavigate,store,localStorageMock});
      b.getBills().then(v => {datas1 = v;})
      store.bills().list().then(data =>{
        const d=data.map(doc => {
          try {
            return {
              ...doc,
              date: formatDate(doc.date),              
              status: formatStatus(doc.status)
            }
          } catch(e) {
            return {
              ...doc,
              date: doc.date,
              status: formatStatus(doc.status)
            }
          }
        }); datas2 = d;});
        await datas1;
        await datas2;
        expect(datas1).toEqual(datas2);
      })
    })
    describe("When I'm on bill page and I click on icon eye", () => {
      test("Then bill details should appear", async () => {
        const root = document.createElement("div")
        root.setAttribute("id", "root")
        document.body.append(root)
        document.getElementById('root').innerHTML = BillsUI({ data: bills })
        // jest.mock('$', () => ({
        //   ...jest.requireActual('$'),
        //   modal: jest.fn(),
        // }));
        const store = storeMock
        const onNavigate = jest.fn()
        let b = new Bills({document,onNavigate,store,localStorageMock})
        b.handleClickIconEye = jest.fn()
        b.document.querySelector(`div[data-testid="icon-eye"]`).click()
        expect(b.handleClickIconEye.mock.calls).toHaveLength(1);
      })
    })
    
})
