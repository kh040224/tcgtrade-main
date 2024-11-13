const express = require('express');
const cors = require('cors');
const {
  getProducts,
  addProduct,
  deleteProduct,
  changeSoldStatus,
  getSoldStatus
} = require('./database');

var corsOptions = {
  origin: 'http://tcgtrade.net/',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const app = express();
app.use(cors());
app.use(express.json());

// 상품 목록 조회
app.get('/api/products', cors(corsOptions), async (req, res) => {
  try {
    const products = await getProducts();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 새 상품 추가
app.post('/api/products', cors(corsOptions), async (req, res) => {
  const { title, items, password } = req.body;
  try {
    const newProduct = await addProduct(title, items, password);
    res.json(newProduct);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 상품 삭제
app.delete('/api/products/:id', cors(corsOptions), async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;
  try {
    const result = await deleteProduct(id, password);
    res.json(result);
  } catch (err) {
    if (err.message === '상품을 찾을 수 없습니다.') {
      res.status(404).json({ error: err.message });
    } else if (err.message === '비밀번호가 일치하지 않습니다.') {
      res.status(403).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// 판매 상태 변경
app.post('/api/products/:id/sold', cors(corsOptions), async (req, res) => {
  const { id } = req.params;
  const { password, itemIndex } = req.body;
  try {
    const result = await changeSoldStatus(id, password, itemIndex);
    res.json(result);
  } catch (err) {
    if (err.message === '상품을 찾을 수 없습니다.') {
      res.status(404).json({ error: err.message });
    } else if (err.message === '비밀번호가 일치하지 않습니다.') {
      res.status(403).json({ error: err.message });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

// 판매 상태 조회
app.get('/api/products/sold-status', cors(corsOptions), async (req, res) => {
  try {
    const soldStatus = await getSoldStatus();
    res.json(soldStatus);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`));