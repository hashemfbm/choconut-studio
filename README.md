# چوکو‌نات · استودیو تولید

ابزار فارسی و راست‌چین برای تنظیم دستور ساخت، حساب‌کردن بهای تولید، برآورد ارزش غذایی و ساخت بنر محصول.

[باز کردن نسخهٔ آنلاین چوکو‌نات](https://hashemfbm.github.io/choconut-studio/)

## اجرا و نصب

- برای اجرا روی کامپیوتر، فایل `index.html` را در مرورگر باز کنید. فونت، ظاهر و محاسبات در همین فایل قرار دارند.
- برای نصب، نسخهٔ میزبانی‌شدهٔ برنامه را با HTTPS باز کنید. در اندروید از منوی Chrome گزینهٔ نصب و در آیفون از منوی اشتراک‌گذاری Safari گزینهٔ **Add to Home Screen** را انتخاب کنید.
- برای توسعهٔ محلی، کل پروژه را با یک سرور فایل اجرا کنید. نمونه با پایتون `python -m http.server 8173` و آدرس `http://localhost:8173`.
- فایل‌های `manifest.webmanifest`، `sw.js` و پوشهٔ `icons` همراه HTML در GitHub Pages منتشر می‌شوند تا نصب و اجرای آفلاین فراهم شود.

## ثبت و گزارش

۱. در **مواد اولیه**، شرح، قیمت هر کیلو به تومان و مقادیر غذایی در هر ۱۰۰ گرم را وارد کنید. مقدار نامشخص را خالی و مقدار صفر را با `۰` ثبت کنید.

۲. در **ساخت محصول جدید**، یک مادهٔ ثبت‌شده را انتخاب کنید یا ردیف دستی بسازید. وزن‌ها به گرم‌اند. هزینهٔ بسته‌بندی، دستمزد و هزینه‌های مشابه را می‌توانید در بخش هزینه‌های جانبی وارد کنید.

۳. اگر وزن بعد از تولید با مجموع وزن مواد فرق دارد، وزن نهایی بچ را وارد کنید. برای محاسبهٔ هر وعده، وزن وعده را هم ثبت کنید.

۴. برای بنر، عکس محصول را اضافه کنید. پس از ذخیره، در **گزارش‌ها** سه خروجی بهای تمام‌شده، ارزش غذایی و بنر در دسترس است. هر سه گزارش را می‌توان به صورت PNG و PDF دریافت کرد. دکمهٔ ارسال در مرورگرهای سازگار فایل را به منوی اشتراک‌گذاری دستگاه می‌دهد. در بقیهٔ مرورگرها می‌توانید فایل را دانلود و به پیام پیوست کنید.

### محاسبات و داده‌ها

- هزینهٔ هر ماده برابر است با وزن مصرفی به گرم ضرب در قیمت هر کیلو و تقسیم بر ۱۰۰۰. بهای بچ، جمع هزینهٔ مواد و هزینه‌های جانبی است. بهای هر کیلو بر مبنای وزن نهایی بچ محاسبه می‌شود.
- ارزش غذایی کل بچ از جمع مقادیر وزنی مواد به دست می‌آید. مقادیر هر ۱۰۰ گرم و هر وعده بر اساس وزن نهایی بچ به دست می‌آیند. علامت «—» برای مقدار نامشخص نمایش داده می‌شود.
- برنامه یک نسخه از قیمت و داده‌های تغذیه‌ای هر ماده را در دستور ذخیره می‌کند. از گزینهٔ به‌روزرسانی در فرم محصول می‌توانید اطلاعات جدید را از فهرست مواد اولیه دریافت کنید.
- اطلاعات و عکس‌ها در مرورگر همین دستگاه ذخیره می‌شوند. نسخهٔ فایل و نسخهٔ آنلاین فضای ذخیرهٔ جدا دارند. برای شروع، چند محصول و مادهٔ نمونه وجود دارد که از صفحهٔ مواد اولیه یا محصولات قابل پاک‌کردن‌اند.

### اجزای بصری

فونت [وزیرمتن](https://github.com/rastikerdar/vazirmatn/tree/v33.003) تحت مجوز SIL Open Font License 1.1 در HTML جاسازی شده است. متن مجوز در `FONT-OFL.txt` قرار دارد.

عکس شکلات و فندقِ پیشخوان با ImageGen ساخته و در `index.html` جاسازی شده است. درخواست تولید تصویر

> Use case: photorealistic-natural. Asset type: landscape hero photograph in a professional Persian confectionery recipe-costing dashboard, with space for a dark plum CSS color overlay at the right. Primary request: rich editorial macro food photography of a pile of broken glossy and matte dark chocolate blocks, cracked cocoa nibs, three warm tan hazelnuts, cracked light beige nut shells, scattered cocoa powder. Scene: deep cool aubergine seamless tabletop, slightly misty fine cocoa powder texture, a single vignette and crisp studio side light. Concentrate all subjects in the left and middle-left, and keep the right third clean continuous dark purple. Wide landscape framing 3:2, high-end artisan confectionery photography from an oblique overhead angle with shallow depth of field, rich browns and toasted copper accent light, deep midnight plum shadows. Aim for convincing natural variations in chocolate textures, a strong silhouette suitable for desktop and mobile cropping. No text, no logos, no border, no panels, no people, no plates, no packaging.
