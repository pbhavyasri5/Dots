import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Lock, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Image } from '@/components/ui/image';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Handpainted Madhubani Art",
      artist: "Priya Sharma",
      price: 2500,
      originalPrice: 3000,
      quantity: 1,
      image: "https://static.wixstatic.com/media/d7d9fb_e6d2f24259d240e9a06ea5b199c5143b~mv2.png?originWidth=128&originHeight=128",
      inStock: true,
      stockCount: 8,
      size: "16x12 inches",
      color: "Traditional"
    },
    {
      id: 2,
      name: "Brass Ganesha Sculpture",
      artist: "Rajesh Kumar",
      price: 4200,
      originalPrice: 5000,
      quantity: 2,
      image: "https://static.wixstatic.com/media/d7d9fb_3af8b4c893d44e2691c21ba0755ef284~mv2.png?originWidth=128&originHeight=128",
      inStock: true,
      stockCount: 3,
      size: "8 inches height",
      color: "Antique Gold"
    },
    {
      id: 3,
      name: "Embroidered Wall Hanging",
      artist: "Meera Devi",
      price: 1800,
      originalPrice: 2200,
      quantity: 1,
      image: "https://static.wixstatic.com/media/d7d9fb_5bc05b22c70146e0acb6efc6c4bf2011~mv2.png?originWidth=128&originHeight=128",
      inStock: false,
      stockCount: 0,
      size: "24x18 inches",
      color: "Multicolor"
    }
  ]);

  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(items =>
      items.map(item => {
        if (item.id === id) {
          const maxQuantity = item.stockCount;
          return {
            ...item,
            quantity: Math.min(newQuantity, maxQuantity)
          };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const applyPromoCode = () => {
    // Simple promo code logic
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setAppliedPromo({ code: 'WELCOME10', discount: 10, type: 'percentage' });
    } else if (promoCode.toUpperCase() === 'SAVE500') {
      setAppliedPromo({ code: 'SAVE500', discount: 500, type: 'fixed' });
    } else {
      alert('Invalid promo code');
      return;
    }
    setPromoCode('');
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const savings = cartItems.reduce((sum, item) => sum + ((item.originalPrice - item.price) * item.quantity), 0);
  
  let discount = 0;
  if (appliedPromo) {
    if (appliedPromo.type === 'percentage') {
      discount = (subtotal * appliedPromo.discount) / 100;
    } else {
      discount = appliedPromo.discount;
    }
  }

  const shipping = subtotal > 2000 ? 0 : 200;
  const tax = Math.round((subtotal - discount) * 0.18); // 18% GST
  const total = subtotal - discount + shipping + tax;

  const inStockItems = cartItems.filter(item => item.inStock);
  const outOfStockItems = cartItems.filter(item => !item.inStock);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ShoppingBag className="w-24 h-24 text-primary/40 mx-auto mb-6" />
            <h1 className="font-heading text-3xl font-bold text-primary mb-4 uppercase tracking-wide">
              Your Cart is Empty
            </h1>
            <p className="font-paragraph text-lg text-primary/70 mb-8">
              Discover beautiful handcrafted artworks and add them to your cart
            </p>
            <Button
              asChild
              size="lg"
              className="bg-neonaccent text-primary hover:bg-neonaccent/90 font-heading font-bold"
            >
              <Link to="/discover">
                Start Shopping
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[120rem] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-heading text-3xl font-bold text-primary uppercase tracking-wide">
              Shopping Cart
            </h1>
            <p className="font-paragraph text-primary/70">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Link to="/discover">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* In Stock Items */}
            {inStockItems.length > 0 && (
              <Card className="border-0">
                <CardHeader>
                  <CardTitle className="font-heading text-xl font-bold text-primary">
                    Available Items ({inStockItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {inStockItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex gap-4 p-4 border border-gray-100 rounded-lg">
                        <Link to={`/product/${item.id}`} className="flex-shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={120}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${item.id}`}>
                            <h3 className="font-heading font-bold text-lg text-primary mb-1 hover:text-black transition-colors">
                              {item.name}
                            </h3>
                          </Link>
                          <p className="font-paragraph text-sm text-primary/60 mb-2">
                            by {item.artist}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              Size: {item.size}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Color: {item.color}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-heading font-bold text-lg text-primary">
                              ₹{item.price.toLocaleString()}
                            </span>
                            <span className="font-paragraph text-sm text-primary/50 line-through">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          </div>
                          <p className="font-paragraph text-xs text-green-600">
                            {item.stockCount} left in stock
                          </p>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>

                          <div className="flex items-center border rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 font-paragraph min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stockCount}
                              className="p-2 hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Out of Stock Items */}
            {outOfStockItems.length > 0 && (
              <Card className="border-0 bg-red-50">
                <CardHeader>
                  <CardTitle className="font-heading text-xl font-bold text-red-600">
                    Out of Stock Items ({outOfStockItems.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {outOfStockItems.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex gap-4 p-4 border border-red-200 rounded-lg opacity-60">
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={120}
                          className="w-24 h-24 object-cover rounded-lg"
                        />

                        <div className="flex-1 min-w-0">
                          <h3 className="font-heading font-bold text-lg text-primary mb-1">
                            {item.name}
                          </h3>
                          <p className="font-paragraph text-sm text-primary/60 mb-2">
                            by {item.artist}
                          </p>
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-heading font-bold text-lg text-primary">
                              ₹{item.price.toLocaleString()}
                            </span>
                          </div>
                          <Badge variant="destructive" className="text-xs">
                            Out of Stock
                          </Badge>
                        </div>

                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <Button size="sm" variant="outline">
                            Move to Wishlist
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-0 sticky top-24">
                <CardHeader>
                  <CardTitle className="font-heading text-xl font-bold text-primary">
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Promo Code */}
                  <div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1"
                      />
                      <Button
                        onClick={applyPromoCode}
                        variant="outline"
                        size="sm"
                        disabled={!promoCode.trim()}
                      >
                        Apply
                      </Button>
                    </div>
                    {appliedPromo && (
                      <div className="flex items-center justify-between mt-2 p-2 bg-green-50 rounded">
                        <span className="font-paragraph text-sm text-green-700">
                          {appliedPromo.code} applied
                        </span>
                        <button
                          onClick={removePromoCode}
                          className="text-green-700 hover:text-green-900"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Price Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-paragraph text-primary/70">Subtotal</span>
                      <span className="font-paragraph text-primary">₹{subtotal.toLocaleString()}</span>
                    </div>
                    
                    {savings > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-paragraph">You Save</span>
                        <span className="font-paragraph">-₹{savings.toLocaleString()}</span>
                      </div>
                    )}

                    {appliedPromo && (
                      <div className="flex justify-between text-green-600">
                        <span className="font-paragraph">Promo Discount</span>
                        <span className="font-paragraph">-₹{discount.toLocaleString()}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="font-paragraph text-primary/70">Shipping</span>
                      <span className="font-paragraph text-primary">
                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-paragraph text-primary/70">Tax (GST)</span>
                      <span className="font-paragraph text-primary">₹{tax.toLocaleString()}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between">
                    <span className="font-heading font-bold text-lg text-primary">Total</span>
                    <span className="font-heading font-bold text-lg text-primary">
                      ₹{total.toLocaleString()}
                    </span>
                  </div>

                  {shipping > 0 && (
                    <div className="text-center p-3 bg-neonaccent/10 rounded-lg">
                      <p className="font-paragraph text-sm text-primary">
                        Add ₹{(2000 - subtotal).toLocaleString()} more for FREE shipping!
                      </p>
                    </div>
                  )}

                  {/* Checkout Button */}
                  <Button
                    size="lg"
                    className="w-full bg-neonaccent text-primary hover:bg-neonaccent/90 font-heading font-bold"
                    disabled={inStockItems.length === 0}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Secure Checkout
                  </Button>

                  {/* Security & Shipping Info */}
                  <div className="space-y-2 text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-primary/60">
                      <Lock className="w-4 h-4" />
                      <span className="font-paragraph">Secure SSL encrypted checkout</span>
                    </div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-primary/60">
                      <Truck className="w-4 h-4" />
                      <span className="font-paragraph">Free shipping on orders over ₹2,000</span>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="text-center">
                    <p className="font-paragraph text-xs text-primary/60 mb-2">We accept</p>
                    <div className="flex justify-center space-x-2">
                      <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center">
                        VISA
                      </div>
                      <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center">
                        MC
                      </div>
                      <div className="w-8 h-5 bg-orange-500 rounded text-white text-xs flex items-center justify-center">
                        UPI
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Recently Viewed */}
        <section className="mt-16">
          <h2 className="font-heading text-2xl font-bold text-primary mb-6 uppercase tracking-wide">
            You Might Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <Card key={item} className="border-0 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Image
                      src={'https://static.wixstatic.com/media/d7d9fb_77d45693ce2b4e57b7c5311fb3049fde~mv2.png?originWidth=256&originHeight=192'}
                      alt={`Suggested product ${item}`}
                      width={300}
                      className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-heading font-bold text-lg text-primary mb-2">
                      Suggested Artwork {item}
                    </h3>
                    <p className="font-paragraph text-sm text-primary/60 mb-2">
                      by Artist Name
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-heading font-bold text-lg text-primary">
                        ₹{(2000 + item * 500).toLocaleString()}
                      </span>
                      <Button size="sm" variant="outline">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}