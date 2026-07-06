
class Component extends DCLogic {
  state = { active: 0, volume: 12, distance: 15, openFaq: 0 };

  products = [
    { name: 'Карьерный', price: 620, desc: 'Универсальный песок для отсыпки, подушек и бетона. Самый популярный в Тюмени.', swatch: 'linear-gradient(135deg,#D9B98A,#B98A4E)' },
    { name: 'Речной', price: 980, desc: 'Чистый, с малым содержанием глины. Для кладки, стяжки и штукатурки.', swatch: 'linear-gradient(135deg,#E0CBA0,#C2A160)' },
    { name: 'Сеяный', price: 760, desc: 'Просеянный без камней и примесей. Для точных строительных работ.', swatch: 'linear-gradient(135deg,#E6D3AE,#C9A96A)' },
    { name: 'Мытый', price: 1120, desc: 'Промытый водой, максимальная чистота. Для ответственного бетона.', swatch: 'linear-gradient(135deg,#EAD9B8,#CDAE72)' },
  ];

  advantages = [
    { num: '01', title: 'Свои карьеры', text: 'Добываем сами, без наценки перекупщиков — цена ниже рынка.' },
    { num: '02', title: 'Честный вес', text: 'Отгрузка с электронных весов. Платите ровно за привезённый объём.' },
    { num: '03', title: 'Доставка за 24 ч', text: 'Самосвалы 5–20 т. Привезём в день заказа или к нужной дате.' },
    { num: '04', title: 'Любая оплата', text: 'Наличные, карта, безнал с НДС. Договор с физ- и юрлицами.' },
  ];

  steps = [
    { n: '1', title: 'Оставляете заявку', text: 'Звонок или расчёт в калькуляторе — подберём вид песка и объём.' },
    { n: '2', title: 'Согласуем цену', text: 'Фиксируем стоимость материала и доставки до вашего адреса.' },
    { n: '3', title: 'Загрузка и весы', text: 'Взвешиваем при загрузке, отправляем самосвал на объект.' },
    { n: '4', title: 'Выгрузка и оплата', text: 'Выгружаем в удобном месте, оплата по факту любым способом.' },
  ];

  faqData = [
    { q: 'Какой минимальный объём заказа?', a: 'Минимальный заказ — 5 м³, это загрузка небольшого самосвала. Для крупных объёмов возим машинами до 20 тонн и организуем несколько рейсов.' },
    { q: 'Как быстро привезёте песок?', a: 'В большинстве случаев доставляем в день обращения или на следующий день. Точное время согласуем при оформлении заявки.' },
    { q: 'Как считается стоимость доставки?', a: 'Подача самосвала — 1 500 ₽ в черте города. Свыше 10 км от Тюмени добавляется 55 ₽ за каждый километр. Итог всегда виден в калькуляторе.' },
    { q: 'Можно ли оплатить по безналу с НДС?', a: 'Да. Работаем с юридическими лицами по договору, предоставляем полный пакет документов и оплату по безналичному расчёту с НДС.' },
    { q: 'Как понять, что вес честный?', a: 'Отгрузка идёт с электронных весов, по запросу предоставляем весовой талон. Вы платите ровно за фактически привезённый объём.' },
  ];

  fmt(n){ return Math.round(n).toLocaleString('ru-RU'); }

  renderVals() {
    const trackStyle = (value, min, max) => {
      const pct = ((value - min) / (max - min)) * 100;
      return `width:100%;-webkit-appearance:none;appearance:none;height:6px;border-radius:3px;background:linear-gradient(#C9812B,#C9812B) no-repeat,#3A362F;background-size:${pct}% 100%;outline:none;cursor:pointer;accent-color:#C9812B`;
    };
    const active = this.products[this.state.active];
    const volume = this.state.volume;
    const distance = this.state.distance;
    const volumeRangeStyle = trackStyle(volume, 5, 60);
    const distanceRangeStyle = trackStyle(distance, 0, 80);
    const tons = (volume * 1.5).toFixed(1);
    const materialCost = active.price * volume;
    const deliveryCost = 1500 + Math.max(0, distance - 10) * 55;
    const total = materialCost + deliveryCost;

    return {
      volumeRangeStyle, distanceRangeStyle,
      volume, distance, tons,
      activeName: active.name,
      materialCost: this.fmt(materialCost),
      deliveryCost: this.fmt(deliveryCost),
      total: this.fmt(total),
      setVolume: (e) => this.setState({ volume: +e.target.value }),
      setDistance: (e) => this.setState({ distance: +e.target.value }),

      products: this.products.map((p, i) => ({
        ...p,
        select: () => this.setState({ active: i }),
        chipStyle: `padding:10px 15px;border-radius:100px;font-size:13.5px;font-weight:600;cursor:pointer;font-family:inherit;transition:.15s;border:1.5px solid ${i === this.state.active ? '#C9812B' : 'rgba(255,255,255,.16)'};background:${i === this.state.active ? '#C9812B' : 'transparent'};color:#fff`,
      })),

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
