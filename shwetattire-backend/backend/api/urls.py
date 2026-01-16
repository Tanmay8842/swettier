from django.urls import path
from .views import (
    get_products,
    get_product_detail,
    get_product_for_cart,
)

urlpatterns = [
    path("products/", get_products, name="get-products"),
    path("products/<int:pk>/", get_product_detail, name="get-product-detail"),
    path("products/cart/<int:pk>/", get_product_for_cart, name="cart-product"),
]
