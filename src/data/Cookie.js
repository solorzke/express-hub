export class Cookie {
	static setCookie(cname, cvalue) {
		const expire = new Date();
		expire.setDate(expire.getDate() + 1);
		document.cookie = `${cname}=${cvalue}; expires=${expire}; path=/`;
	}

	static getCookie(cname) {
		let name = cname + '=';
		let decodedCookie = decodeURIComponent(document.cookie);
		let ca = decodedCookie.split(';');
		for (var i = 0; i < ca.length; i++) {
			var c = ca[i];
			while (c.charAt(0) == ' ') {
				c = c.substring(1);
			}
			if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			}
		}
		return '';
	}

	static deleteCookie(cname) {
		document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
	}

	static checkCookie(cname) {
		var username = this.getCookie(cname);
		return username != '' ? true : false;
	}
}
