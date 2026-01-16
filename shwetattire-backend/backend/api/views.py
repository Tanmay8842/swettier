from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404

from .models import Product
from .serializers import ProductSerializer


# ============================
# GET ALL PRODUCTS
# ============================
@api_view(["GET"])
def get_products(request):
    products = Product.objects.all().order_by("-created_at")
    serializer = ProductSerializer(products, many=True, context={"request": request})
    return Response(serializer.data)


# ============================
# GET SINGLE PRODUCT
# ============================
@api_view(["GET"])
def get_product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(product, context={"request": request})
    return Response(serializer.data)


# ============================
# CART SAFE PRODUCT
# ============================
@api_view(["GET"])
def get_product_for_cart(request, pk):
    product = get_object_or_404(Product, pk=pk)

    return Response({
        "id": product.id,
        "name": product.name,
        "price": product.price,
        "stock": product.stock,
        "image": request.build_absolute_uri(product.image.url) if product.image else None
    })
