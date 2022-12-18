import React, {
	useRef,
	useState,
	useLayoutEffect,
	useMemo,
	useEffect
} from "react";
import {
	defaultContainerBufferSize,
	scrollContainerDefaultStyles,
	virtualScrollEvent
} from "./constants";
import { TScrollPosition, TVirtualScrollContainerProps } from "./types";

export default function VirtualScrollContainer({
	children,
	itemHeight,
	getChildProps,
	onChildrenRendered,
	virtualScrollContainerProps,
	containerBufferSize = defaultContainerBufferSize
}: TVirtualScrollContainerProps) {
	const wrapperHeight = useMemo(() => children.length * itemHeight, [children]);

	const [containerRef, scrollPosition] = useScrollPosition(
		children,
		itemHeight,
		containerBufferSize
	);

	const renderedChildren = useRenderedChildren(
		children,
		scrollPosition,
		onChildrenRendered
	);

	const transform = useMemo(
		() => `translateY(${scrollPosition.elementOffsetHeight}px)`,
		[scrollPosition.elementOffsetHeight]
	);

	const virtualScrollContainerAllProps = useMemo(
		() => ({
			...virtualScrollContainerProps,
			style: {
				...scrollContainerDefaultStyles,
				...(virtualScrollContainerProps?.style
					? virtualScrollContainerProps.style
					: {})
			}
		}),
		[virtualScrollContainerProps]
	);

	return (
		<div ref={containerRef} {...virtualScrollContainerAllProps}>
			<div
				style={{
					height: `${wrapperHeight}px`
				}}
			>
				{renderedChildren.map((child, index) => {
					const elementProps = !!getChildProps
						? getChildProps(child, index)
						: { style: {} };

					elementProps.style = {
						...elementProps?.style,
						transform: transform
					};

					return <div {...elementProps}>{child}</div>;
				})}
			</div>
		</div>
	);
}

const scrollPositionStateDefaults: Readonly<TScrollPosition> = {
	elementOffsetHeight: 0,
	firstIndex: 0,
	lastIndex: 0
};

function useRenderedChildren(
	children: React.ReactNode[],
	scrollPosition: TScrollPosition,
	onChildrenRendered?: (children: React.ReactNode[]) => void
) {
	const [renderedChildren, setRenderedChildren] = useState<React.ReactNode[]>(
		[]
	);

	useEffect(() => {
		setRenderedChildren(
			children.slice(scrollPosition.firstIndex, scrollPosition.lastIndex)
		);

		if (!!onChildrenRendered) {
			onChildrenRendered(renderedChildren);
		}
	}, [scrollPosition.firstIndex, scrollPosition.lastIndex, children]);

	return renderedChildren;
}

function useScrollPosition(
	children: React.ReactNode[],
	itemHeight: number,
	containerBufferSize: number
): [React.RefObject<HTMLDivElement>, TScrollPosition] {
	const [state, setState] = useState<TScrollPosition>({
		...scrollPositionStateDefaults
	});

	const containerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		function handleScroll() {
			const container = containerRef.current!;

			const bufferSizeMinusOne = containerBufferSize - 1;
			const bufferSizeOffset = bufferSizeMinusOne < 0 ? 0 : bufferSizeMinusOne;

			const scrollTopOffset = bufferSizeOffset * container.clientHeight;
			const scrollTop = Math.max(container.scrollTop - scrollTopOffset, 0);
			const firstIndex = Math.floor(scrollTop / itemHeight);

			const lastIndexOffset = (2 * scrollTopOffset) / itemHeight + firstIndex;
			const lastIndex = Math.min(
				children.length,
				lastIndexOffset + Math.ceil(container.clientHeight / itemHeight)
			);

			const elementOffsetHeight = firstIndex * itemHeight;
			setState({
				firstIndex: firstIndex,
				elementOffsetHeight: elementOffsetHeight,
				lastIndex: lastIndex
			});
		}

		const container = containerRef.current!;
		handleScroll();
		container.addEventListener(virtualScrollEvent, handleScroll);

		return () => {
			container.removeEventListener(virtualScrollEvent, handleScroll);
		};
	}, []);

	return [containerRef, state];
}
