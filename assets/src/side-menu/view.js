import { getContext, store, useEffect } from '@wordpress/interactivity';

const { state, actions } = store("SideMenuBlock", {
	state: {
		visibleMenus: {
			main: true
		},
		currentMenuId: 'main',
		get isCurrentMenuMain() {
			return state.currentMenuId === 'main';
		},
		get isVisibleMenuMain() {
			return state.currentMenuId === 'main' ? 'visible' : 'hidden';
		}
	},
	actions: {
		stopPropagation: (event) => {
			event.stopPropagation();
		},
		resetState: () => {
			state.currentMenuId = 'main';
			state.visibleMenus = { main: true };
		},
		toggleDrawer: () => {
			const context = getContext();
			if (context.isOpen === false) {
				context.isOpen = true;
				document.body.classList.add('drawer-open');
			} else {
				actions.closeDrawer();
			}
		},
		closeDrawer: () => {
			const context = getContext();
			context.isOpen = false;
			document.body.classList.remove('drawer-open');
			actions.resetState();
		},
		openSubMenu: (event) => {
			const context = getContext();
			const submenuId = event.target.dataset.submenuId;
			state.currentMenuId = submenuId;
			state.visibleMenus = { [submenuId]: true };
		},
		goBack: () => {
			actions.resetState();
		},
	},
	callbacks: {
		setupModal: () => {
			const context = getContext();

			useEffect(() => {
				if (!context.isOpen) {
					actions.resetState();
				}
			}, [context.isOpen]);
		}
	}
});
