const express = require('express');
const router = express.Router();
const ProductModel = require('../models/productModel');

router.get('/', async (req, res) => {
  try {
    const products = await ProductModel.getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, items, password } = req.body;
    if (!title || !items || !password) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }
    const newProduct = await ProductModel.addProduct({ title, items, password });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ error: '비밀번호가 필요합니다.' });
    }
    
    await ProductModel.deleteProduct(req.params.id, password);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    } else if (error.message === 'Incorrect password') {
      res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    } else {
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
  }
});

// 제품 수정 라우트 추가
router.put('/:id', async (req, res) => {
  try {
    const { title, items, password } = req.body;
    if (!title || !items || !password) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }
    
    const updatedProduct = await ProductModel.updateProduct(req.params.id, { title, items, password });
    res.json(updatedProduct);
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    } else if (error.message === 'Incorrect password') {
      res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    } else {
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
  }
});

// 판매 상태 변경 라우트 추가
router.post('/:id/sold', async (req, res) => {
  try {
    const { password, itemIndex } = req.body;
    if (!password || itemIndex === undefined) {
      return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
    }
    
    await ProductModel.updateSoldStatus(req.params.id, itemIndex, password);
    res.json({ message: '판매 상태가 성공적으로 변경되었습니다.' });
  } catch (error) {
    if (error.message === 'Product not found') {
      res.status(404).json({ error: '상품을 찾을 수 없습니다.' });
    } else if (error.message === 'Incorrect password') {
      res.status(400).json({ error: '비밀번호가 일치하지 않습니다.' });
    } else {
      res.status(500).json({ error: '서버 오류가 발생했습니다.' });
    }
  }
});

// 판매 상태 조회 라우트 추가
router.get('/sold-status', async (req, res) => {
  try {
    const soldStatus = await ProductModel.getSoldStatus();
    res.json(soldStatus);
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

module.exports = router;