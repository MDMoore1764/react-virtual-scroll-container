export type TVirtualScrollContainerProps = {
	/**The children. Array required. */
	children: React.ReactNode[];
	/**The height of each item in pixels. This includes padding and margin.
	 * The item height determines the current render item given scroll position. Not adhering to this value may cause skipping or other rendering oddities.
	 * Elements below this size will damage the continuity of the virtual scroll.
	 * Elements exceeding this size will cause elements to skip around in position as the container is scrolled through.
	 * It is recommended that each element adhere to this size for perfect scrolling. However, occasional maladherence is often covered up.
	 * */
	itemHeight: number;
	/**The number of containers to render.
	 * Minimum 1.
	 * 1 will render only the exact number of elements to fill the container.
	 * 2 will render one container size before the viewport container and one after.
	 * Any valid number greater than one can be specified.
	 * Greater numbers will reduce performance.
	 * Greater numbers will reduce the visibility of the empty scroll region when quickly scrolling.
	 * Larger numbers are recommended for smaller containers.
	 * Default: 1.5.
	 * */
	containerBufferSize?: number;
	/**Given a child element, generate the element's wrapper's props. Key inclusion is recommended for performance. */
	getChildProps?: (
		/**The child element.*/
		child: React.ReactNode,
		/**The index of the child in the rendered child list. */
		index: number
	) => React.DetailedHTMLProps<
		React.HTMLAttributes<HTMLDivElement>,
		HTMLDivElement
	>;
	/**Invoked whenever the rendered children change (on scroll), providing the rendered children in an array. */
	onChildrenRendered?: (childrenRendered: React.ReactNode[]) => void;
	/**Props for the container surrounding the child node list. It is recommended that container padding be avoided. Container width and height calculations will need to be provided to accomodate. Prefer applying padding and margin to each element, using border-boxes, and adjusting the itemHeight property accordingly. */
	virtualScrollContainerProps?: Omit<
		React.DetailedHTMLProps<
			React.HTMLAttributes<HTMLDivElement>,
			HTMLDivElement
		>,
		"ref"
	>;
};

export type TScrollPosition = {
	/**The index of the first element to render. */
	firstIndex: number;
	/**The index of the last element to render. */
	lastIndex: number;
	/**The element offset from the top of the scroll container. */
	elementOffsetHeight: number;
};
