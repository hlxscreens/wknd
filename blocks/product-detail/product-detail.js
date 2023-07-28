import { onNavigate } from '../../scripts/scripts.js';

let isLoading = false;
let variantData;
let variantSelected;
// const renderSkeleton = () => document.createElement('div');
const backButtonClick = () => {
  const productListing = document.getElementsByClassName('product-listing')[0];
  productListing.setAttribute('update', true);
  onNavigate('product-listing-container');
};

const homeButtonClick = () => {
  onNavigate('category-container');
};

const handleImgVariants = (event) => {
  console.log(event.currentTarget);
  console.log('abc');
  const original = document.getElementsByClassName('product-info-img-original');
  console.log(original);
  if (original.length) {
    original[0].classList.add('hide');
  }
  const imgDiv = document.getElementsByClassName('variants--variant-imglist');
  if (imgDiv.length) {
    imgDiv[0].classList.add('show');
    // eslint-disable-next-line no-restricted-syntax
    for (const child of imgDiv[0].children) {
      if (child.getAttribute('index') === event.currentTarget.getAttribute('index')) {
        child.classList.add('show');
        console.log('show', child);
      } else {
        console.log('remove', child);
        child.classList.remove('show');
      }
    }
  }
};

const navigationButton = (className, url, callback, alt) => {
  const navigationBtn = document.createElement('div');
  navigationBtn.className = className;
  const btnSVG = new Image();
  btnSVG.src = url;
  btnSVG.alt = alt || 'btn';
  navigationBtn.append(btnSVG);
  const btnText = document.createElement('div');
  btnText.textContent = alt;
  navigationBtn.append(btnText);
  navigationBtn.addEventListener('click', callback);
  return navigationBtn;
};

const getProductInfo = (product) => {
  // outer-div
  const productInfo = document.createElement('div');
  productInfo.className = 'product-info';
  // variants images
  const productImgDiv = document.createElement('div');
  productImgDiv.className = 'product-info-img';
  const variantsThumbnailFlexbox = document.createElement('div');
  variantsThumbnailFlexbox.className = 'variants';
  const variantsImgs = document.createElement('div');
  variantsImgs.className = 'variants--variant-imglist';
  console.log(variantSelected);
  if (variantData) {
    variantData.forEach((variant, idx) => {
      const variantThumbnailDiv = document.createElement('div');
      variantThumbnailDiv.className = 'variants--variant';
      const variantThumbnailImg = new Image();
      variantThumbnailImg.src = variant.product.thumbnail.url;
      variantThumbnailImg.alt = variant.product.thumbnail.label;
      variantThumbnailDiv.append(variantThumbnailImg);
      variantThumbnailDiv.addEventListener('click', handleImgVariants);
      variantThumbnailDiv.setAttribute('index', idx);
      variantsThumbnailFlexbox.append(variantThumbnailDiv);
      const variantImgDiv = document.createElement('div');
      variantImgDiv.className = 'variant-img-div';
      const productImg = new Image();
      productImg.className = 'variants--variant-img';
      productImg.src = variant.product.image.url;
      productImg.alt = variant.product.thumbnail.label;
      variantImgDiv.appendChild(productImg);
      variantImgDiv.setAttribute('index', idx);
      variantsImgs.append(variantImgDiv);
    });
    const originalImgDiv = document.createElement('div');
    originalImgDiv.className = 'product-info-img-original';
    const productImg = new Image();
    productImg.src = product.image.url;
    productImg.alt = 'product-info-img';
    originalImgDiv.append(productImg);
    productImgDiv.append(originalImgDiv);
    productImgDiv.append(variantsImgs);
    productImgDiv.append(variantsThumbnailFlexbox);
  } else {
    const productImg = new Image();
    productImg.src = product.image.url;
    productImg.alt = 'product-info-img';
    productImgDiv.append(productImg);
  }
  // productInfo.append(variantsThumbnailFlexbox);
  const productTitle = document.createElement('h1');
  productTitle.textContent = product.name;
  productInfo.append(productImgDiv);
  productInfo.append(productTitle);
  return productInfo;
};

const renderProduct = (target, product) => {
  const productInfo = getProductInfo(product);
  target.textContent = '';
  const backButtonDiv = navigationButton('back-btn', 'https://main--wknd--hlxscreens.hlx.live/screens-demo/left-arrow-svgrepo-com.svg', backButtonClick, 'BACK');
  const homeButtonDiv = navigationButton('home-btn', 'https://main--wknd--hlxscreens.hlx.live/screens-demo/home-icon-silhouette-svgrepo-com.svg', homeButtonClick, 'HOME');
  target.append(backButtonDiv);
  target.append(homeButtonDiv);
  target.append(productInfo);
};

const observer = new MutationObserver((mutations) => {
  Promise.all(mutations.map(async (mutation) => {
    if (mutation.type === 'attributes') {
      console.log('Mutation target', mutation.target);
      const productSKU = mutation.target.getAttribute('sku');
      const product = mutation.target.dataset?.object && JSON.parse(mutation.target.dataset.object);
      if (!productSKU || !product) return;
      if (isLoading) {
        console.log('returning subsequent calls');
        return;
      }
      // renderSkeleton(product);
      // fetch data
      isLoading = true;
      // fetch from graphql apis
      const response = product;
      try {
        console.log(product);
        const { sku } = product;
        const rawResponse = await fetch(`https://productdetails-p7pabzploq-uc.a.run.app?sku=${sku}`);
        const { items } = (await rawResponse.json()).products;
        if (Array.isArray(items) && items.length) {
          variantData = items[0].variants;
          variantSelected = 1;
        }
        console.log(variantData);
      } catch (e) {
        console.log('error in fetching variants');
      }
      console.log(variantData);
      renderProduct(mutation.target, response);
      isLoading = false;
    }
  }));
});
export default function decorate(block) {
  observer.observe(block, {
    attributes: true, // configure it to listen to attribute changes
  });
  block.textContent = '';
}
