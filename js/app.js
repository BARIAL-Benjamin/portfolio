const age = (() => {
    const b = new Date("2002-04-15");
    const n = new Date();
    const m = n.getMonth() - b.getMonth();
    let y = n.getFullYear() - b.getFullYear();
    if (m < 0 || (m === 0 && n.getDate() < b.getDate())) y--;
    return y;
})()

const ages = document.querySelectorAll('.age');

ages.forEach(el => {
    el.textContent = `${age} ans`;
});