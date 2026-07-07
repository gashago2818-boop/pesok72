
class Component extends DCLogic {
  state = { openFaq: 0 };

  // Photos: Wikimedia Commons, CC BY / CC BY-SA (attribution required) or CC0.
  // crupno.jpg    - "A heap of sharp sand" by Confidence24, CC BY-SA 4.0
  // sredne.jpg    - "Heap of Fine Construction Sand" by Paul The Writer, CC0
  // tehno.jpg     - "Pile of Sand for Building in Anambra State" by Johnnybam, CC BY-SA 4.0
  // otsypka.jpg   - "Sand and Gravel Extraction" by Anne Burgess (geograph.org.uk), CC BY-SA 2.0
  // suhaya.jpg    - "Another pile of Sand" by Bill Nicholls (geograph.org.uk), CC BY-SA 2.0
  // shcheben.jpg  - "Sorted gravel pile..." by James St. John, CC BY 2.0
  // about.jpg     - "Sand and gravel pit" by Roger W Haworth (geograph.org.uk), CC BY-SA 2.0
  products = [
    { name: 'Крупнозернистый', desc: 'Плотный, с крупной фракцией. Для бетона, дорожных работ и высоких нагрузок.', img: 'img/crupno.jpg' },
    { name: 'Среднезернистый', desc: 'Универсальный вариант для кладки, стяжки и общестроительных работ.', img: 'img/sredne.jpg' },
    { name: 'Технологический', desc: 'Для производственных нужд и технических площадок.', img: 'img/tehno.jpg' },
    { name: 'Для отсыпки', desc: 'Отсыпка участков, дорог и оснований под фундамент.', img: 'img/otsypka.jpg' },
    { name: 'Сухой добычи', desc: 'Минимальная влажность, удобен для хранения и точного дозирования.', img: 'img/suhaya.jpg' },
    { name: 'Щебень', desc: 'Разные фракции для бетона, дренажа и отсыпки.', img: 'img/shcheben.jpg' },
  ];

  advantages = [
    { num: '01', title: 'Свои карьеры', text: 'Добываем сами, без наценки перекупщиков — цена ниже рынка.' },
    { num: '02', title: 'Честный вес', text: 'Отгрузка с электронных весов. Платите ровно за привезённый объём.' },
    { num: '03', title: 'Доставка на след. день', text: 'Заявка сегодня — самосвал от 10 тонн привозим на объект завтра.' },
    { num: '04', title: 'Любая оплата', text: 'Наличные, карта, безнал с НДС. Договор с физ- и юрлицами.' },
  ];

  steps = [
    { n: '1', title: 'Оставляете заявку', text: 'Звонок или заявка на сайте — подберём вид материала и объём.' },
    { n: '2', title: 'Подтверждаем заказ', text: 'Согласуем объём, адрес и удобное время доставки на завтра.' },
    { n: '3', title: 'Загрузка и весы', text: 'Взвешиваем при загрузке, отправляем самосвал на объект.' },
    { n: '4', title: 'Выгрузка и оплата', text: 'Выгружаем в удобном месте, оплата по факту любым способом.' },
  ];

  faqData = [
    { q: 'Какой минимальный объём заказа?', a: 'Минимальный заказ — от 10 тонн, это один самосвал. Для крупных объёмов возим машинами до 20 тонн и организуем несколько рейсов.' },
    { q: 'Как быстро привезёте песок?', a: 'Работаем по схеме: сегодня оставляете заявку — завтра привозим материал на объект. Точное время согласуем при оформлении заявки.' },
    { q: 'Сколько это будет стоить?', a: 'Материалы — от 250 ₽ за 1 м³, точная стоимость с доставкой зависит от вида материала, объёма и адреса. Уточним по телефону при оформлении заявки.' },
    { q: 'Можно ли оплатить по безналу с НДС?', a: 'Да. Работаем с юридическими лицами по договору, предоставляем полный пакет документов и оплату по безналичному расчёту с НДС.' },
    { q: 'Как понять, что вес честный?', a: 'Отгрузка идёт с электронных весов, по запросу предоставляем весовой талон. Вы платите ровно за фактически привезённый объём.' },
  ];

  renderVals() {
    return {
      products: this.products,
      advantages: this.advantages,
      steps: this.steps,

      faqs: this.faqData.map((f, i) => {
        const open = this.state.openFaq === i;
        return {
          ...f,
          toggle: () => this.setState({ openFaq: open ? -1 : i }),
          iconStyle: `flex:none;width:30px;height:30px;border-radius:50%;background:${open ? '#C9812B' : '#EDE6D8'};color:${open ? '#fff' : '#C9812B'};display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:500;transition:.2s;transform:rotate(${open ? 45 : 0}deg)`,
          answerStyle: `overflow:hidden;color:#5A544A;font-size:15px;line-height:1.6;max-width:660px;transition:.25s ease;max-height:${open ? 200 : 0}px;opacity:${open ? 1 : 0};margin-top:${open ? 14 : 0}px`,
        };
      }),
    };
  }
}
