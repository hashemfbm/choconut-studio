import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';
import {runInNewContext} from 'node:vm';

const html = readFileSync(new URL('../index.html',import.meta.url),'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
const source = scripts.at(-1)[1].replace(/\binit\(\);\s*$/,'');
const node = {addEventListener(){}};
const document = {...node,querySelector:() => node,documentElement:{style:{setProperty(){}}}};
const app = runInNewContext(source + `\n({
  allocateMolds,bannerPages,computeRecipe,format,parseBackup,pricePerKilo,reportModel,sheetPages,snapshot,validDay,workspaceData,
})`,{document,window:node,atob});

const pricingDate = 1795536000000;
const hazelnut = {id:'hazelnut',name:'فندق',pricing:{amount:820000,unit:'kg',packGrams:null,updatedAt:pricingDate},nutrition:{energy:646}};
const cocoa = {id:'cocoa',name:'کاکائو',pricing:{amount:120000,unit:'pack',packGrams:250,updatedAt:pricingDate},nutrition:{energy:228}};
const recipe = {
  id:'sample-batch',name:'شکلات آزمایشی',description:'',finishedWeight:480,serving:null,extraCost:18000,photo:null,
  updatedAt:pricingDate,bannerWeight:60,
  rows:[{...app.snapshot(hazelnut),grams:300},{...app.snapshot(cocoa),grams:200}],
};
const batch = {...recipe,number:'ت-۴۲',date:'2026-11-24',molds:[{grams:50,quantity:5},{grams:70,quantity:null}]};

test('converts kilogram, gram and package pricing using net weight',() => {
  assert.equal(app.pricePerKilo(hazelnut.pricing),820000);
  assert.equal(app.pricePerKilo(cocoa.pricing),480000);
  assert.equal(app.pricePerKilo({amount:480,unit:'g'}),480000);
  assert.equal(app.pricePerKilo(null),null);
  assert.equal(recipe.rows[1].priceAt,pricingDate);
});

test('uses final weight to allocate costs to fixed molds, automatic molds and leftover',() => {
  const result = app.computeRecipe(batch);
  assert.equal(result.rawWeight,500);
  assert.equal(result.finishedWeight,480);
  assert.equal(result.totalCost,360000);
  assert.equal(result.costPerKg,750000);
  assert.equal(result.allocation.groups[0].unitCost,37500);
  assert.equal(result.allocation.groups[1].quantity,3);
  assert.equal(result.allocation.groups[1].unitCost,52500);
  assert.equal(result.allocation.leftover,20);
  assert.equal(result.allocation.leftoverCost,15000);
  assert.equal(result.allocation.groups.reduce((sum,mold) => sum+mold.cost,0)+result.allocation.leftoverCost,result.totalCost);
  const model = app.reportModel(batch,'cost');
  assert.ok(model.meta.includes(batch.number));
  assert.ok(model.sections[1].rows.some(row => row[2] === app.format(52500)));
  assert.equal(app.sheetPages(model.sections).length,1);
});

test('rejects over-allocation and multiple automatic sizes without dropping fractional units',() => {
  assert.equal(app.allocateMolds([{grams:70,quantity:7}],480,100).reason,'overweight');
  assert.equal(app.allocateMolds([{grams:50,quantity:null},{grams:70,quantity:null}],480,100).reason,'multiple-auto');
  assert.equal(app.allocateMolds([{grams:500,quantity:null}],480,100).valid,false);
  assert.equal(app.allocateMolds([{grams:.1,quantity:null}],.3,100).groups[0].quantity,3);
});

test('scales both banner tables by the same requested weight',() => {
  const banner = app.reportModel(batch,'banner').banner;
  assert.equal(banner.weight,60);
  assert.equal(banner.ingredients.rows[0][1],app.format(37.5));
  assert.equal(banner.ingredients.rows[1][1],app.format(25));
  assert.equal(banner.nutrition.rows[0][1],app.format(299.25));
  assert.equal(app.reportModel({...batch,bannerWeight:null},'banner').banner.weight,50);
  const rows = Array.from({length:29},(_,i) => ({...recipe.rows[0],name:`ماده ${i}`}));
  assert.equal(app.bannerPages(app.reportModel({...recipe,rows},'banner')),3);
});

test('paginates a report without dropping rows or repeating totals',() => {
  const rows = Array.from({length:50},(_,i) => [i]);
  const plans = app.sheetPages([{title:'مواد',rows,total:['جمع']}]);
  assert.equal(plans.flatMap(page => page.segments.flatMap(segment => segment.rows)).length,50);
  assert.equal(plans.flatMap(page => page.segments.filter(segment => segment.total)).length,1);
});

test('migrates version-one backups and validates current production backups',() => {
  const legacy = {id:'old-food',name:'مادهٔ قدیمی',price:300000,nutrition:{energy:600}};
  const oldRecipe = {...recipe,rows:[{ingredientId:legacy.id,name:legacy.name,grams:480,price:legacy.price,nutrition:legacy.nutrition}]};
  delete oldRecipe.bannerWeight;
  const old = app.parseBackup(JSON.stringify({type:'choconut-studio',version:1,data:{ingredients:[legacy],products:[oldRecipe]}}));
  assert.equal(old.ingredients[0].pricing.amount,300000);
  assert.equal(old.ingredients[0].pricing.updatedAt,null);
  assert.equal(old.products[0].rows[0].price,300000);
  assert.equal(old.batches.length,0);
  const data = {ingredients:[hazelnut,cocoa],products:[],batches:[batch]};
  const restored = app.parseBackup(JSON.stringify({type:'choconut-studio',version:2,data}));
  assert.equal(restored.batches[0].bannerWeight,60);
  assert.equal(restored.ingredients[1].pricing.updatedAt,pricingDate);
  assert.throws(() => app.workspaceData({...data,batches:[batch,{...batch,id:'other',number:'ت-42'}]}));
  assert.throws(() => app.workspaceData({...data,batches:[{...batch,molds:[{grams:1000,quantity:2}]}]}));
  assert.equal(app.validDay('2026-02-30'),false);
  assert.equal(app.validDay('2026-11-24'),true);
});
