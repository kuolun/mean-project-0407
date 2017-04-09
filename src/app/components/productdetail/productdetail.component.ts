import { Http } from '@angular/http';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from './../../shared/services/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})
export class ProductdetailComponent implements OnInit {

  product;

  quantity = 1;

  constructor(
    private _route: ActivatedRoute,
    private _http: Http,
    private _router: Router,
    private _auth: AuthService
  ) { }


  changeQty(num) {
    this.quantity += num;
    if (this.quantity < 1) {
      this.quantity = 1;
    }
  }


  subtotal() {
    return this.quantity * this.product.price
  }


  onBack() {
    this._router.navigate(['/']);
  }


  addToCart() {

    let cartData = this._auth.userProfile.data;

    let item = {
      product: this.product._id,
      quantity: this.quantity,
      subtotal: this.subtotal()
    }

    cartData.cart.push(item);
    cartData.totalValue += this.subtotal();

    //更新DB
    this._http.put('http://localhost:3000/api/updateCart', {
      newCart: cartData.cart,
      newTotal: cartData.totalValue,
      email: this._auth.userProfile.email
    }).
      subscribe(user => console.log(user));
  }



  ngOnInit() {
    //用URL上id取得product data
    const url = 'http://localhost:3000/api/product';
    const id = this._route.snapshot.params['id'];
    this._http.get(`${url}/${id}`)
      .map(res => res.json().product)
      .subscribe(product => {
        this.product = product;
      });
  }

}
