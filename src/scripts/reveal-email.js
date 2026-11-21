/* Email is never written in the HTML: elements carry base64 in data-mail /
   data-mail-text and are filled in here, which defeats plain-text scrapers. */
function revealEmails() {
  document.querySelectorAll('[data-mail]').forEach(function (a) {
    var addr = atob(a.getAttribute('data-mail'));
    a.setAttribute('href', 'mailto:' + addr);
    var t = a.querySelector('.mail-text');
    if (t) t.textContent = addr;
  });
  document.querySelectorAll('[data-mail-text]').forEach(function (n) {
    n.textContent = atob(n.getAttribute('data-mail-text'));
  });
}
revealEmails();
