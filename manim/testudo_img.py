from manim import *

PARCHMENT = "#D4C5A9"
DARK = "#1a1a1a"
RED = "#8B1A1A"
GREEN = "#4A8C3F"

IMG_DIR = "../public/tacticas-romanas"
BG = f"{IMG_DIR}/Solid_parchment_background,_aged_sand-colored_202606271650.jpeg"
GRID = f"{IMG_DIR}/Grid_layout_on_solid_parchment_202606271726.jpeg"
SOLDIERS = f"{IMG_DIR}/soldiers.png"
ARROWS = f"{IMG_DIR}/arrows.png"
ICON = f"{IMG_DIR}/icon.png"
TITLE = f"{IMG_DIR}/title.png"
FULL_IMG = f"{IMG_DIR}/Simple_cartoon_illustration_on_solid_202606271610.jpeg"


class TestudoFullScene(Scene):
    def setup(self):
        self.camera.background_color = PARCHMENT

    def construct(self):
        # ═══ SCENE 1: Grid overview → zoom to testudo (0-5s) ═══
        grid = ImageMobject(GRID).scale_to_fit_width(14.2)
        self.play(FadeIn(grid, run_time=1))
        self.wait(0.5)

        # Zoom into testudo (top-left circle)
        self.play(
            grid.animate.scale(5).move_to(RIGHT * 4 + DOWN * 2),
            run_time=2,
            rate_func=rate_functions.ease_in_out_sine,
        )
        self.wait(1.5)

        # ═══ SCENE 2: Transition to detail scene (5-7s) ═══
        # Fade out grid
        bg = ImageMobject(BG).scale_to_fit_width(14.2)
        self.play(
            FadeOut(grid, run_time=0.8),
            FadeIn(bg, run_time=0.8),
        )

        # ═══ SCENE 3: Title drops in (7-9s) ═══
        title_img = ImageMobject(TITLE).scale_to_fit_width(12)
        title_img.to_edge(UP, buff=0.3)
        title_img.shift(UP * 3)  # Start off-screen

        self.play(
            title_img.animate.shift(DOWN * 3),
            run_time=0.8,
            rate_func=rate_functions.ease_out_bounce,
        )
        self.wait(0.5)

        # ═══ SCENE 4: Icon pops in (9-10s) ═══
        icon_img = ImageMobject(ICON).scale_to_fit_width(1.5)
        icon_img.to_corner(UR, buff=0.5)
        icon_img.scale(0.01)  # Start tiny

        self.play(
            icon_img.animate.scale(100),
            run_time=0.6,
            rate_func=rate_functions.ease_out_back,
        )
        self.wait(0.3)

        # ═══ SCENE 5: Soldiers rise from bottom (10-13s) ═══
        soldiers_img = ImageMobject(SOLDIERS).scale_to_fit_width(11)
        soldiers_img.move_to(DOWN * 0.5)
        soldiers_start = soldiers_img.get_center().copy()
        soldiers_img.shift(DOWN * 5)  # Start off-screen below

        self.play(
            soldiers_img.animate.move_to(soldiers_start),
            run_time=1.5,
            rate_func=rate_functions.ease_out_back,
        )
        self.wait(0.5)

        # ═══ SCENE 6: Narration text 1 (13-17s) ═══
        narr1 = Text(
            "Los legionarios levantaban sus escudos\ncreando un caparazón impenetrable",
            font="Georgia", font_size=30, color=WHITE,
            line_spacing=1.3,
        )
        narr1_bg = SurroundingRectangle(
            narr1, fill_color=BLACK, fill_opacity=0.8,
            buff=0.3, corner_radius=0.15, stroke_width=0
        )
        narr1_group = VGroup(narr1_bg, narr1).to_edge(DOWN, buff=0.4)

        self.play(FadeIn(narr1_group, shift=UP * 0.4), run_time=0.6)
        self.wait(2.5)
        self.play(FadeOut(narr1_group), run_time=0.4)

        # ═══ SCENE 7: Arrows fly in (17-20s) ═══
        arrows_img = ImageMobject(ARROWS).scale_to_fit_width(10)
        arrows_img.move_to(UP * 0.8)
        arrows_start = arrows_img.get_center().copy()
        arrows_img.shift(RIGHT * 8 + UP * 5)  # Start off-screen upper-right

        self.play(
            arrows_img.animate.move_to(arrows_start),
            run_time=1.2,
            rate_func=rate_functions.ease_out_quad,
        )

        # Impact flash
        flash_circle = Circle(
            radius=2, fill_color=GOLD, fill_opacity=0.4, stroke_width=0
        ).move_to(soldiers_img.get_top() + UP * 0.3)
        self.play(
            FadeIn(flash_circle, run_time=0.15),
            FadeOut(flash_circle, run_time=0.3),
        )

        # IMPENETRABLE text
        impact = Text(
            "¡IMPENETRABLE!", font="Impact", font_size=70, color=RED,
        ).to_edge(UP, buff=0.3)
        self.play(GrowFromCenter(impact, run_time=0.5))
        self.wait(0.5)

        # ═══ SCENE 8: Narration 2 (20-24s) ═══
        narr2 = Text(
            "Las flechas rebotaban. Las piedras resbalaban.\nEra como un tanque humano imparable.",
            font="Georgia", font_size=30, color=WHITE,
            line_spacing=1.3,
        )
        narr2_bg = SurroundingRectangle(
            narr2, fill_color=BLACK, fill_opacity=0.8,
            buff=0.3, corner_radius=0.15, stroke_width=0
        )
        narr2_group = VGroup(narr2_bg, narr2).to_edge(DOWN, buff=0.4)

        self.play(FadeIn(narr2_group, shift=UP * 0.4), run_time=0.6)
        self.wait(2.5)

        # ═══ SCENE 9: Ken Burns + fade out (24-30s) ═══
        self.play(FadeOut(narr2_group), FadeOut(impact), FadeOut(arrows_img), run_time=0.6)

        # Gentle zoom on soldiers
        self.play(
            soldiers_img.animate.scale(1.15).shift(LEFT * 0.3 + UP * 0.2),
            run_time=4,
            rate_func=rate_functions.ease_in_out_sine,
        )

        # Final narration
        narr3 = Text(
            "La usaban para acercarse a las murallas\nsin perder un solo hombre.",
            font="Georgia", font_size=30, color=WHITE,
            line_spacing=1.3,
        )
        narr3_bg = SurroundingRectangle(
            narr3, fill_color=BLACK, fill_opacity=0.8,
            buff=0.3, corner_radius=0.15, stroke_width=0
        )
        narr3_group = VGroup(narr3_bg, narr3).to_edge(DOWN, buff=0.4)
        self.play(FadeIn(narr3_group, shift=UP * 0.3), run_time=0.5)
        self.wait(1.5)

        # Fade everything out
        self.play(
            *[FadeOut(mob) for mob in self.mobjects],
            run_time=1,
        )
