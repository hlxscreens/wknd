import { onNavigate, sendAnalyticsEvent } from '../../scripts/scripts.js';

let isLoading = false;
let variantData;
let variantSelected;
let ratingsLocation;
let ratingsData;
let description;
let latitude;
let longitude;
let store;
let sku;
let offers;
let offersData;

const hasOffer = () => {
  const isOfferEnabled = offers && offers.type && offers.count && offers.order && offers.discount;
  return isOfferEnabled;
};

const productOnOffer = (productSku) => {
  const isOfferEnabled = hasOffer();
  if (!isOfferEnabled || !offersData) return false;
  return offersData.find((productInOffer) => productInOffer.sku === productSku);
};

// const renderSkeleton = () => document.createElement('div');
const backButtonClick = () => {
  const productListing = document.getElementsByClassName('product-listing')[0];
  productListing.setAttribute('update', true);
  const { lastNavigationTime } = window;
  const visitingTime = Math.floor((new Date() - lastNavigationTime) / 1000);
  if (sku) {
    sendAnalyticsEvent({
      type: 'duration',
      start: (new Date()).toISOString(),
      end: (new Date()).toISOString(),
      value: `Product with SKU ${sku} visited for ${visitingTime} seconds`,
    });
  }
  onNavigate('product-listing-container');
};

const homeButtonClick = () => {
  const { lastNavigationTime } = window;
  const visitingTime = Math.floor((new Date() - lastNavigationTime) / 1000);
  if (sku) {
    sendAnalyticsEvent({
      type: 'duration',
      start: (new Date()).toISOString(),
      end: (new Date()).toISOString(),
      value: `Product with SKU ${sku} visited for ${visitingTime} seconds`,
    });
  }
  onNavigate('category-container');
};

const fetchCoordinates = async () => {
  if (navigator && navigator.geolocation) {
    try {
      await navigator.geolocation.getCurrentPosition((position) => {
        latitude = position.coords.latitude;
        longitude = position.coords.longitude;
      });
    } catch (err) {
      console.log(err);
    }
  }
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
      if (idx > 4) return;
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
  const productDescription = document.createElement('div');
  const productTitle = document.createElement('h1');
  productTitle.textContent = product.name;
  const productPrice = document.createElement('div');
  const priceSpan = document.createElement('span');
  priceSpan.textContent = 'Starts at $';
  const price = document.createElement('span');
  price.className = 'product-price';
  price.textContent = `${product.price_range.minimum_price.final_price.value}`;
  productPrice.append(priceSpan);
  productPrice.append(price);
  if (productOnOffer(product.sku)) {
    price.classList.add('strike');
    const originalPrice = product.price_range.minimum_price.final_price.value;
    console.log(product.price_range.minimum_price.final_price.value);
    console.log(product.price_range.minimum_price.final_price.value + 1);
    const discount = Number(offers.discount.slice(0, -1));
    const newPrice = (originalPrice * (100 - discount)) / 100;
    const newPriceSpan = document.createElement('span');
    newPriceSpan.className = 'newproduct-price';
    const discountPrice = document.createElement('span');
    discountPrice.textContent = `$${newPrice}`;
    const discountDetail = document.createElement('span');
    discountDetail.textContent = `(-${discount}%)`;
    newPriceSpan.append(discountPrice);
    newPriceSpan.append(discountDetail);
    productPrice.append(newPriceSpan);
  }
  const ratingsDiv = document.createElement('div');
  ratingsDiv.className = 'Stars';
  ratingsDiv.style.setProperty('--rating', ratingsData.find((rating) => rating.SKU === product.sku).Rating);
  const productDescriptionText = document.createElement('div');
  productDescriptionText.className = 'product-description-text';
  console.log('desc', description);
  productDescriptionText.innerHTML = description.html;
  const locationDiv = document.createElement('div');
  locationDiv.innerHTML = `Location in ${store} store - ${ratingsData.find((data) => data.SKU === product.sku).Location}`;
  productDescription.append(productTitle);
  productDescription.append(productPrice);
  productDescription.append(ratingsDiv);
  productDescription.append(productDescriptionText);
  productDescription.append(locationDiv);
  productInfo.append(productImgDiv);
  productInfo.append(productDescription);
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
      // console.log('Mutation target', mutation.target);
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
        const section = document.getElementsByClassName('section product-listing-container');
        if (section) {
          ratingsLocation = section[0].dataset.ratingsLocation;
        }
        sku = product.sku;
        const rawResponse = await fetch(`https://productdetails-p7pabzploq-uc.a.run.app?sku=${sku}`);
        const { items } = (await rawResponse.json()).products;
        if (Array.isArray(items) && items.length) {
          description = items[0].description;
          variantData = items[0].variants;
          variantSelected = 1;
        }
        console.log(variantData);
        let url = ratingsLocation;
        await fetchCoordinates();
        if (latitude && longitude) {
          url = `${ratingsLocation}?latitude=${latitude}&longitude=${longitude}`;
        }
        if (hasOffer()) {
          const offersRawResponse = await fetch(`https://offer-p7pabzploq-uc.a.run.app?type=${offers.type}&order=${offers.order}&count=${offers.count}`);
          offersData = await offersRawResponse.json();
          console.log(offersData);
        }
        const rawRatingsResponse = await fetch(url);
        const ratingsresponse = await rawRatingsResponse.json();
        store = ratingsresponse.store;
        ratingsData = ratingsresponse?.data;
        console.log(ratingsresponse?.data);
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
  const offerContainer = document.getElementsByClassName('section offers-container');
  if (offerContainer.length) {
    const offersList = document.getElementsByClassName('offers block');
    if (offersList.length) {
      const [offersBlock] = offersList;
      offers = {
        type: offersBlock.children[0].children[0].textContent,
        order: offersBlock.children[0].children[1].textContent,
        count: offersBlock.children[0].children[2].textContent,
        discount: offersBlock.children[0].children[3].textContent,
      };
      console.log('[offers]', offers);
    }
  }
  observer.observe(block, {
    attributes: true, // configure it to listen to attribute changes
  });
  block.textContent = '';
}
