import { AuthService } from './../../shared/services/auth.service';
import { Http } from '@angular/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  user;

  constructor(private _auth: AuthService, private _http: Http) { }

  ngOnInit() {
    //利用service的user profile去DB載入完整的product資料
    this._auth.loadUser(this._auth.userProfile)
      .subscribe(data => {
        this.user = this._auth.userProfile = data.loadedUser;
      })
  }

  removeProduct(productIndex) {
    console.log(this.user);
    //更新service的總金額
    this.user.data.totalValue -= this.user.data.cart[productIndex].subtotal;
    //移除點選的product
    this.user.data.cart.splice(productIndex, 1);
    //update DB
    let updatedItem = {
      cart: this.user.data.cart,
      totalValue: this.user.data.totalValue
    }
    this._http.put('http://localhost:3000/api/remove', {
      updatedItem: updatedItem,
      email: this.user.email
    }).
      subscribe(user => console.info('updatedItem:', user));
  }

}
