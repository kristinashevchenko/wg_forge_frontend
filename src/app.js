import orders from '../data/orders.json';
import users from '../data/users.json';
import companies from '../data/companies.json';

export default (function () {
    let prevTarget, rates, currentCurrancy = "USD";
    startFunc();

    /**Start function for application*/
    function startFunc() {
        addStyle();
        document.getElementById("app").innerHTML = '<table class="table table-striped">\n' +
            '    <thead>\n' +
            '        <tr class="bg-warning">\n' +
            '            <th>Transaction ID</th>\n' +
            '            <th>User Info</th>\n' +
            '            <th>Order Date</th>\n' +
            '            <th>Order Amount<span class="close" id="usd">?</span></th>\n' +
            '            <th>Card Number</th>\n' +
            '            <th>Card Type</th>\n' +
            '            <th>Location</th>\n' +
            ' <th>Search:</th>\n' +
            '    <th><input type="text" id="search"></th>' +
            '        </tr>\n' +
            '    </thead>\n' +
            '    <tbody>\n' +
            '    </tbody>\n' +
            '</table>';

        document.getElementById("search").addEventListener("input", filterOrders);
        document.getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].addEventListener("click", sortOrders);
        document.getElementById("usd").addEventListener("click", showDialog);
        fetch("https://api.exchangeratesapi.io/latest").then(function (response) {
            response.json().then(res => {
                rates = res.rates;
                rates["EUR"] = 1;
                let number = rates["USD"];
                Object.keys(rates).forEach(function (elem) {
                    rates[elem] /= number;
                });
                createTable(orders);
            });
        });

    }

    /**Creates modal dialog for choosing currancy*/
    function showDialog() {
        let modal = document.createElement("div");
        modal.className = "modal";
        modal.id = "myModal";
        modal.innerHTML = ' <div class="modal-content">\n' +
            '<div class="modal-header">\n' +
            '            <h4>Choose currency</h4>\n' +
            '            <span class="close">&times;</span>\n' +
            '        </div>' +
            '        <div class="modal-body">\n' +
            '              <select class="form-control-sm" id="selectUSD">\n' +
            '        </select>' +
            '<button type="button" class="btn btn-warning" id="buttonUSD">OK</button>' +
            '        </div>\n' +
            '    </div>';

        document.getElementById("app").appendChild(modal);
        Object.keys(rates).forEach(function (elem) {
            let option = document.createElement("option");
            option.text = elem;
            option.value = elem;
            document.getElementById("selectUSD").appendChild(option);
        });

        modal.getElementsByTagName("span")[0].onclick = function () {
            document.getElementById("app").removeChild(modal);
        }
        document.getElementById("buttonUSD").addEventListener("click", changeUSD);
    }

    /**Sorts orders according to clicked property
     * @param {Object} event standart object with information about event*/
    function sortOrders(event) {
        let compare;
        if (event.target.textContent === "Order Amount?") {
            compare = function (a, b) {
                return a.total - b.total;
            }
        }
        if (event.target.textContent === "Order Date") {
            compare = function (a, b) {
                return a.created_at - b.created_at;
            }
        }
        if (event.target.textContent === "Card Type") {
            compare = function (a, b) {
                if (a.card_type > b.card_type) return 1;
                else if (a.card_type < b.card_type) return -1;
                else return 0;
            }
        }
        if (event.target.textContent === "Location") {
            compare = function (a, b) {
                if (a.order_country > b.order_country) return 1;
                else if (a.order_country < b.order_country) return -1;
                else {
                    if (a.order_ip > b.order_ip) return 1;
                    else if (a.order_ip < b.order_ip) return -1;
                    else return 0;
                }
            }
        }
        if (event.target.textContent === "User Info") {
            compare = function (a, b) {
                let userA, userB;
                for (let i = 0; i < users.length; i++) {
                    if (users[i].id === a.user_id)
                        userA = users[i];
                    if (users[i].id === b.user_id)
                        userB = users[i];
                    if (userA && userB) break;

                }
                if (userA.first_name > userB.first_name) return 1;
                else if (userA.first_name < userB.first_name) return -1;
                else {
                    if (userA.last_name > userB.last_name) return 1;
                    else if (userA.last_name < userB.last_name) return -1;
                    else return 0;
                }
            }
        }
        if (compare) {
            orders.sort(compare);
            if (prevTarget)
                prevTarget.removeChild(prevTarget.children[0]);
            let span = document.createElement("span");
            span.innerHTML = "&#8595;";
            event.target.appendChild(span);
            prevTarget = event.target;
            createTable(orders);
        }
    }

    /**Add style to the page*/
    function addStyle() {
        let link = document.createElement("link");
        link.setAttribute("rel", "stylesheet");
        link.setAttribute("href", "https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css");
        link.setAttribute("integrity", "sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO");
        link.setAttribute("crossorigin", "anonymous");

        let style = document.createElement('style');
        style.type = 'text/css';
        let h = 'th:hover{cursor:pointer;}' +
            '.user-data-hide{display:none;}' +
            '.yellow-td{background:#f1fa7a}';
        let hover = document.createTextNode(h);
        style.appendChild(hover);

        h = '.close {\n' +
            '    color: seagreen;\n' +
            '    float: right;\n' +
            '    font-size: 20px;\n' +
            '    font-weight: bold;\n' +
            '}\n' +
            '.close:hover,\n' +
            '.close:focus {\n' +
            '    color: #000;\n' +
            '    text-decoration: none;\n' +
            '}' +
            '.modal {\n' +
            '    font-family: Arial, Helvetica, sans-serif;\n' +
            '    position: fixed; \n' +
            'display:block;\n' +
            '    z-index: 1; \n' +
            '    padding-top: 100px; \n' +
            '    left: 0;\n' +
            '    top: 0;\n' +
            '    width: 100%; \n' +
            '    height: 100%; \n' +
            '    overflow: auto; \n' +
            '    background-color: rgb(0,0,0); \n' +
            '    background-color: rgba(0,0,0,0.4); \n' +
            '}\n' +
            '.modal-content {\n' +
            '    position: relative;\n' +
            '    background-color: white;\n' +
            '    margin: auto;\n' +
            '    padding: 0;\n' +
            '    border: 2px solid black;\n' +
            '    width: 250px;\n' +
            '    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);\n' +
            '}' +
            '.modal-body {\n' +
            '   width:250px;\n' +
            '}' +
            '.modal-header {\n' +
            '    padding: 2px 16px;\n' +
            '    background-color: white;\n' +
            '    color: black;\n' +
            '}' +
            '#buttonUSD{' +
            'margin-left:80px' +
            '}';
        hover = document.createTextNode(h);
        style.appendChild(hover);
        document.head.appendChild(link);
        document.head.appendChild(style);
    }

    /**Changes current currancy according to selected*/
    function changeUSD() {
        currentCurrancy = document.getElementById("selectUSD").value;
        document.getElementById("app").removeChild(document.getElementById("myModal"));
        createTable(orders);
    }

    /**Filter orders according to entered info*/
    function filterOrders() {
        let str = document.getElementById("search").value;
        let filterOrd = orders.filter(function (elem) {
            if (elem.id.toString().indexOf(str, 0) !== -1) return true;
            if (elem.user_id.toString().indexOf(str, 0) !== -1) return true;
            if (elem.total.toString().indexOf(str, 0) !== -1) return true;
            if (elem.card_type.indexOf(str, 0) !== -1) return true;
            if (elem.order_country.indexOf(str, 0) !== -1) return true;
            if (elem.order_ip.indexOf(str, 0) !== -1) return true;
            if (elem.transaction_id.indexOf(str, 0) !== -1) return true;
            let user = users.find(function (elem2) {
                if (elem2.id === elem.user_id) return true;
                return false;
            });
            if (user.first_name.indexOf(str, 0) !== -1) return true;
            if (user.last_name.indexOf(str, 0) !== -1) return true;
            return false;
        });
        if (filterOrd.length) createTable(filterOrd);
        else document.getElementsByTagName("tbody")[0].innerHTML = '<tr>\n' +
            '    <td colspan="9">Nothing found</td>\n' +
            '</tr>';
    }

    /**Creates table with orders
     * @param {Array} orders*/
    function createTable(orders) {
        let statistic = {
            numberOrders: orders.length,
            totalOrders: 0,
            totalF: 0,
            totalM: 0,
            numberF: 0,
            numberM: 0
        };
        let objectF = {};
        let objectM = {};
        document.getElementsByTagName("tbody")[0].innerHTML = "";
        for (let i = 0; i < orders.length; i++) {
            let user = users.find(function (elem) {
                if (elem.id === orders[i].user_id) return true;
                return false;
            });
            let company = companies.find(function (elem) {
                if (elem.id === user.company_id) return true;
                return false;
            });
            let tr = document.createElement("tr");
            tr.id = "order_" + orders[i].id;
            let td = new Array(7);
            for (let j = 0; j < 7; j++) {
                td[j] = document.createElement("td");
                tr.appendChild(td[j]);
            }
            td[0].textContent = orders[i].transaction_id;

            td[1].className = "user-data";
            let a = document.createElement("a");
            a.href = "#";
            let str = user.first_name + " " + user.last_name;
            if (user.gender === "Male") {
                if (!objectM[str]) {
                    statistic.numberM++;
                    objectM[str] = 1;
                }
                a.textContent = "Mr. " + str;
                statistic.totalM += +orders[i].total;
            }
            else {
                if (!objectF[str]) {
                    statistic.numberF++;
                    objectF[str] = 1;
                }
                a.textContent = "Ms. " + str;
                statistic.totalF += +orders[i].total;
            }
            let div = document.createElement("div");
            div.className = "user-details user-data-hide";
            div.innerHTML = '            <p>Birthday: </p>\n' +
                '            <p><img width="100px"></p>\n';
            if (company) {
                div.innerHTML += '            <p>Company: <a href="#" target="_blank"></a></p>\n' +
                    '            <p>Industry: </p>\n';
            }
            let p = div.getElementsByTagName("p");
            p[0].textContent += user.birthday ? (new Date(+user.birthday * 1000)).toLocaleDateString("en-GB") : "Unknown";
            if (user.avatar)
                p[1].firstChild.src = user.avatar;
            if (company) {
                if (company.url)
                    p[2].children[0].href = company.url;
                p[2].children[0].textContent = company.title;
                p[3].textContent += (company.industry + " / " + company.sector);
            }

            a.onclick = function (e) {
                e.preventDefault();
                div.classList.toggle("user-data-hide");
            };
            td[1].appendChild(a);
            td[1].appendChild(div);

            td[2].textContent = (new Date(+orders[i].created_at * 1000)).toLocaleString('en-GB', {hour12: true});
            if (currentCurrancy === "USD")
                td[3].textContent = "$" + orders[i].total;
            else td[3].textContent = (rates[currentCurrancy] * orders[i].total).toFixed(2) + " " + currentCurrancy;
            statistic.totalOrders += +orders[i].total;
            let len = orders[i].card_number.length;
            td[4].textContent = orders[i].card_number.replace(/./g, function (c, i) {
                if (i === 0 || i === 1 || i === len - 1 || i === len - 2)
                    return c;
                return "*";
            });
            td[5].textContent = orders[i].card_type;
            td[6].textContent = orders[i].order_country + " (" + orders[i].order_ip + ")";
            td[6].setAttribute("colspan", "3");
            document.getElementsByTagName("tbody")[0].appendChild(tr);
        }

        let tr = document.createElement("tr");
        tr.innerHTML = '            <td colspan="3" class="yellow-td">Orders Count</td>\n';
        let td = document.createElement("td");
        orders.length ? td.textContent = statistic.numberOrders : td.innerHTML = '`n/a';
        td.setAttribute("colspan", "6");
        td.setAttribute("class", "yellow-td");
        tr.appendChild(td);
        document.getElementsByTagName("tbody")[0].appendChild(tr);

        tr = document.createElement("tr");
        tr.innerHTML = '            <td colspan="3">Orders Total</td>\n';
        td = document.createElement("td");
        orders.length ? td.textContent = (rates[currentCurrancy] * statistic.totalOrders).toFixed(2) + " " + currentCurrancy : td.innerHTML = '`n/a';
        td.setAttribute("colspan", "6");
        tr.appendChild(td);
        document.getElementsByTagName("tbody")[0].appendChild(tr);

        tr = document.createElement("tr");
        tr.innerHTML = '            <td colspan="3" class="yellow-td">Median Value</td>\n';
        td = document.createElement("td");
        orders.length ? td.textContent = ((orders.slice().sort(function (a, b) {
            return a.total - b.total;
        })[Math.floor(orders.length / 2)].total * rates[currentCurrancy]).toFixed(2) + " " + currentCurrancy) : td.innerHTML = '`n/a';
        td.setAttribute("colspan", "6");
        td.setAttribute("class", "yellow-td");
        tr.appendChild(td);
        document.getElementsByTagName("tbody")[0].appendChild(tr);

        tr = document.createElement("tr");
        tr.innerHTML = '            <td colspan="3">Average Check</td>\n';
        td = document.createElement("td");
        orders.length ? td.textContent = ((rates[currentCurrancy] * statistic.totalOrders / statistic.numberOrders).toFixed(2) + " " + currentCurrancy) : td.innerHTML = '`n/a';
        td.setAttribute("colspan", "6");
        tr.appendChild(td);
        document.getElementsByTagName("tbody")[0].appendChild(tr);

        tr = document.createElement("tr");
        tr.innerHTML = '            <td colspan="3" class="yellow-td">Average Check (Female)</td>\n';
        td = document.createElement("td");
        statistic.numberF ? td.textContent = ((rates[currentCurrancy] * statistic.totalF / statistic.numberF).toFixed(2) + " " + currentCurrancy) : td.innerHTML = '`n/a';
        td.setAttribute("colspan", "6");
        td.setAttribute("class", "yellow-td");
        tr.appendChild(td);
        document.getElementsByTagName("tbody")[0].appendChild(tr);

        tr = document.createElement("tr");
        tr.innerHTML = '            <td colspan="3">Average Check (Male)</td>\n';
        td = document.createElement("td");
        statistic.numberM ? td.textContent = ((rates[currentCurrancy] * statistic.totalM / statistic.numberM).toFixed(2) + " " + currentCurrancy) : td.innerHTML = '`n/a';
        td.setAttribute("colspan", "6");
        tr.appendChild(td);
        document.getElementsByTagName("tbody")[0].appendChild(tr);
    }
}());
