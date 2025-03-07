window.customBlockToggleDropdown = function () {
	var dropdown = document.querySelector(".fse-block-toolkit-currency-switcher__dropdown");
	dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
}

window.customBlockSelectCurrency = function (code) {
	document.getElementById("fse-block-toolkit-currency-switcher-input").value = code;
	document.querySelector(".fse-block-toolkit-currency-switcher form").submit();
}

document.addEventListener("DOMContentLoaded", function () {
	document.addEventListener("click", function (event) {
		var switcher = document.querySelector(".fse-block-toolkit-currency-switcher");
		var dropdown = document.querySelector(".fse-block-toolkit-currency-switcher__dropdown");
		if (switcher && dropdown && !switcher.contains(event.target)) {
			dropdown.style.display = "none";
		}
	});

	let switcher = document.querySelector(".fse-block-toolkit-currency-switcher");
	if (switcher) {
		switcher.addEventListener("mouseleave", function () {
			document.querySelector(".fse-block-toolkit-currency-switcher__dropdown").style.display = "none";
		});
	}

});

