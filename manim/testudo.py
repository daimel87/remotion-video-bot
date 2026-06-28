from manim import *

PARCHMENT = "#D4C5A9"
DARK = "#1a1a1a"
RED = "#8B1A1A"
GOLD = "#D4A843"
SHIELD_RED = "#7A1818"
GREEN = "#4A8C3F"
HELMET = "#B8860B"
SKIN = "#F5D0A9"


class Soldier(VGroup):
    def __init__(self, shield_up=False, **kwargs):
        super().__init__(**kwargs)
        # Body
        body = RoundedRectangle(
            width=0.5, height=0.7, corner_radius=0.08,
            fill_color=RED, fill_opacity=1, stroke_color=DARK, stroke_width=1.5
        )
        # Armor strips
        for i in range(3):
            strip = Rectangle(
                width=0.42, height=0.06,
                fill_color=GOLD, fill_opacity=1, stroke_width=0.5
            ).move_to(body.get_top() + DOWN * (0.15 + i * 0.15))
            self.add(strip)

        # Head
        head = Circle(
            radius=0.22, fill_color=SKIN, fill_opacity=1,
            stroke_color=DARK, stroke_width=1.5
        ).next_to(body, UP, buff=0.02)

        # Eyes
        eye_l = Dot(point=head.get_center() + LEFT * 0.08 + UP * 0.04, radius=0.04, color=DARK)
        eye_r = Dot(point=head.get_center() + RIGHT * 0.08 + UP * 0.04, radius=0.04, color=DARK)

        # Helmet
        helmet = ArcBetweenPoints(
            head.get_left() + UP * 0.05, head.get_right() + UP * 0.05,
            angle=-PI * 0.8, fill_color=HELMET, fill_opacity=1,
            stroke_color=DARK, stroke_width=1.5
        )
        crest = Rectangle(
            width=0.08, height=0.25, fill_color=RED, fill_opacity=1,
            stroke_width=0.5
        ).next_to(helmet, UP, buff=-0.05)

        # Legs
        leg_l = Rectangle(
            width=0.12, height=0.35, fill_color="#8B6914", fill_opacity=1,
            stroke_width=1
        ).next_to(body, DOWN, buff=0).shift(LEFT * 0.1)
        leg_r = leg_l.copy().shift(RIGHT * 0.2)

        # Sandals
        sandal_l = Rectangle(
            width=0.16, height=0.06, fill_color="#5C4A1E", fill_opacity=1,
            stroke_width=0.5
        ).next_to(leg_l, DOWN, buff=0)
        sandal_r = sandal_l.copy().next_to(leg_r, DOWN, buff=0)

        self.add(leg_l, leg_r, sandal_l, sandal_r, body, head, eye_l, eye_r, helmet, crest)

        # Shield
        if shield_up:
            shield = RoundedRectangle(
                width=0.7, height=0.35, corner_radius=0.05,
                fill_color=SHIELD_RED, fill_opacity=1,
                stroke_color=GOLD, stroke_width=2
            ).next_to(helmet, UP, buff=0.05).rotate(0.15)
            emblem = Ellipse(width=0.2, height=0.15, fill_color=GOLD, fill_opacity=1, stroke_width=0).move_to(shield)
            self.add(shield, emblem)
        else:
            shield = RoundedRectangle(
                width=0.35, height=0.6, corner_radius=0.05,
                fill_color=SHIELD_RED, fill_opacity=1,
                stroke_color=GOLD, stroke_width=2
            ).next_to(body, LEFT, buff=-0.05)
            emblem = Ellipse(width=0.12, height=0.18, fill_color=GOLD, fill_opacity=1, stroke_width=0).move_to(shield)
            self.add(shield, emblem)


class TestudoTitleScene(Scene):
    def setup(self):
        self.camera.background_color = PARCHMENT

    def construct(self):
        # Turtle icon
        icon_bg = Circle(radius=1.2, fill_color=GREEN, fill_opacity=1, stroke_width=0)
        turtle = SVGMobject("turtle.svg").set_color(WHITE).scale(0.7).move_to(icon_bg) if False else Text(
            "🐢", font_size=100
        ).move_to(icon_bg)
        icon = VGroup(icon_bg, turtle).shift(UP * 1)

        # Title
        title = Text(
            "FORMACIÓN TESTUDO",
            font="Impact", font_size=80, color=DARK,
            weight=BOLD
        ).next_to(icon, DOWN, buff=0.5)

        # Subtitle
        subtitle = Text(
            "La tortuga de guerra romana",
            font="Georgia", font_size=36, color="#5C4A2A",
            slant=ITALIC
        ).next_to(title, DOWN, buff=0.3)

        # Animations
        self.play(
            GrowFromCenter(icon_bg, run_time=0.8),
            FadeIn(turtle, scale=0.5, run_time=0.8),
        )
        self.play(
            Write(title, run_time=1.2),
        )
        self.play(
            FadeIn(subtitle, shift=UP * 0.3, run_time=0.8),
        )
        self.wait(1)


class TestudoFormationScene(Scene):
    def setup(self):
        self.camera.background_color = PARCHMENT

    def construct(self):
        # Ground
        ground = Ellipse(width=10, height=1, fill_color="#A0896B", fill_opacity=1, stroke_width=0).shift(DOWN * 2.5)
        self.play(FadeIn(ground, run_time=0.5))

        # Front row soldiers (shields front)
        front_row = VGroup()
        for i in range(5):
            s = Soldier(shield_up=False).scale(0.7).move_to(
                LEFT * 2.4 + RIGHT * i * 1.2 + DOWN * 1.2
            )
            front_row.add(s)

        # Back row soldiers (shields up)
        back_row = VGroup()
        for i in range(4):
            s = Soldier(shield_up=True).scale(0.7).move_to(
                LEFT * 1.8 + RIGHT * i * 1.2 + UP * 0.2
            )
            back_row.add(s)

        # Animate soldiers appearing one by one
        for s in back_row:
            self.play(
                FadeIn(s, shift=UP * 0.5, scale=0.5),
                run_time=0.3
            )

        for s in front_row:
            self.play(
                FadeIn(s, shift=UP * 0.5, scale=0.5),
                run_time=0.3
            )

        # Roof shields
        roof = VGroup()
        for i in range(5):
            for j in range(3):
                shield = RoundedRectangle(
                    width=1.1, height=0.55, corner_radius=0.05,
                    fill_color=SHIELD_RED, fill_opacity=0.9,
                    stroke_color=GOLD, stroke_width=2
                ).move_to(LEFT * 2.4 + RIGHT * i * 1.1 + UP * 0.8 + UP * j * 0.5)
                emblem = Ellipse(
                    width=0.25, height=0.18, fill_color=GOLD,
                    fill_opacity=1, stroke_width=0
                ).move_to(shield)
                roof.add(VGroup(shield, emblem))

        self.play(
            LaggedStart(*[FadeIn(s, scale=0.5) for s in roof], lag_ratio=0.05),
            run_time=1.5
        )

        # Narration text
        narration = Text(
            "Los legionarios creaban un caparazón impenetrable",
            font="Georgia", font_size=32, color=WHITE,
        )
        bg_box = SurroundingRectangle(
            narration, fill_color=BLACK, fill_opacity=0.75,
            buff=0.3, corner_radius=0.15, stroke_width=0
        )
        narr_group = VGroup(bg_box, narration).to_edge(DOWN, buff=0.5)

        self.play(FadeIn(narr_group, shift=UP * 0.3), run_time=0.6)
        self.wait(2)


class TestudoArrowsScene(Scene):
    def setup(self):
        self.camera.background_color = PARCHMENT

    def construct(self):
        # Static formation
        formation = VGroup()
        ground = Ellipse(width=10, height=1, fill_color="#A0896B", fill_opacity=1, stroke_width=0).shift(DOWN * 2.5)
        formation.add(ground)

        for i in range(5):
            s = Soldier(shield_up=False).scale(0.65).move_to(LEFT * 2.2 + RIGHT * i * 1.1 + DOWN * 1.2)
            formation.add(s)
        for i in range(4):
            s = Soldier(shield_up=True).scale(0.65).move_to(LEFT * 1.6 + RIGHT * i * 1.1 + UP * 0.1)
            formation.add(s)
        for i in range(5):
            for j in range(3):
                shield = RoundedRectangle(
                    width=1.0, height=0.5, corner_radius=0.05,
                    fill_color=SHIELD_RED, fill_opacity=0.9,
                    stroke_color=GOLD, stroke_width=2
                ).move_to(LEFT * 2.2 + RIGHT * i * 1.0 + UP * 0.7 + UP * j * 0.45)
                formation.add(shield)

        self.add(formation)

        # Arrows flying in
        arrows = VGroup()
        for i in range(8):
            start = RIGHT * 7 + UP * (3 - i * 0.5)
            end = LEFT * (0.5 - i * 0.3) + UP * (1.5 - i * 0.2)
            arrow = Arrow(
                start=start, end=end, color="#3D2B1F",
                stroke_width=3, tip_length=0.2, max_stroke_width_to_length_ratio=10
            )
            arrows.add(arrow)

        self.play(
            LaggedStart(*[GrowArrow(a) for a in arrows], lag_ratio=0.1),
            run_time=2
        )

        # Impact flashes
        flashes = VGroup()
        for i in range(5):
            flash = Star(
                n=6, outer_radius=0.3, inner_radius=0.1,
                fill_color=GOLD, fill_opacity=1, stroke_width=0
            ).move_to(LEFT * 1.5 + RIGHT * i * 0.8 + UP * 1.8)
            flashes.add(flash)

        self.play(
            LaggedStart(*[Flash(f, color=GOLD, flash_radius=0.4) for f in flashes], lag_ratio=0.08),
            run_time=0.8
        )

        # IMPENETRABLE text
        impact_text = Text(
            "¡IMPENETRABLE!", font="Impact", font_size=72, color=RED,
        ).to_edge(UP, buff=0.5)

        self.play(
            GrowFromCenter(impact_text, run_time=0.6),
        )

        # Narration
        narration = Text(
            "Las flechas rebotaban. Las piedras resbalaban.",
            font="Georgia", font_size=32, color=WHITE,
        )
        bg_box = SurroundingRectangle(
            narration, fill_color=BLACK, fill_opacity=0.75,
            buff=0.3, corner_radius=0.15, stroke_width=0
        )
        narr_group = VGroup(bg_box, narration).to_edge(DOWN, buff=0.5)
        self.play(FadeIn(narr_group, shift=UP * 0.3), run_time=0.6)
        self.wait(2)


class TestudoAdvanceScene(Scene):
    def setup(self):
        self.camera.background_color = PARCHMENT

    def construct(self):
        # Ground
        ground = Rectangle(
            width=16, height=3, fill_color="#A0896B", fill_opacity=1, stroke_width=0
        ).shift(DOWN * 2.5)
        self.add(ground)

        # Wall
        wall = VGroup()
        wall_body = Rectangle(
            width=1.5, height=4, fill_color="#8B7355", fill_opacity=1,
            stroke_color="#6B5340", stroke_width=2
        ).shift(RIGHT * 5.5 + UP * 0.5)
        for i in range(3):
            battlement = Rectangle(
                width=0.4, height=0.4, fill_color="#8B7355", fill_opacity=1,
                stroke_color="#6B5340", stroke_width=1
            ).move_to(wall_body.get_top() + UP * 0.2 + LEFT * 0.4 + RIGHT * i * 0.4)
            wall.add(battlement)
        wall.add(wall_body)
        self.play(FadeIn(wall, shift=LEFT * 0.5), run_time=0.5)

        # Formation
        formation = VGroup()
        for i in range(4):
            s = Soldier(shield_up=True).scale(0.55).move_to(LEFT * 3.5 + RIGHT * i * 0.9 + UP * 0.1)
            formation.add(s)
        for i in range(5):
            s = Soldier(shield_up=False).scale(0.55).move_to(LEFT * 3.9 + RIGHT * i * 0.9 + DOWN * 1)
            formation.add(s)
        # Roof
        for i in range(4):
            shield = RoundedRectangle(
                width=0.85, height=0.4, corner_radius=0.04,
                fill_color=SHIELD_RED, fill_opacity=0.9,
                stroke_color=GOLD, stroke_width=1.5
            ).move_to(LEFT * 3.5 + RIGHT * i * 0.85 + UP * 0.7)
            formation.add(shield)

        self.play(FadeIn(formation, shift=RIGHT * 0.5), run_time=0.5)

        # Direction arrow
        direction = Arrow(
            start=formation.get_right() + RIGHT * 0.3,
            end=wall_body.get_left() + LEFT * 0.3,
            color=RED, stroke_width=4
        )
        direction_dashed = DashedVMobject(direction, num_dashes=15)
        self.play(Create(direction_dashed), run_time=0.5)

        # Advance animation
        self.play(
            formation.animate.shift(RIGHT * 4),
            run_time=3,
            rate_func=rate_functions.ease_in_out_sine
        )

        # Narration
        narration = Text(
            "Un tanque humano que avanzaba hacia las murallas",
            font="Georgia", font_size=32, color=WHITE,
        )
        bg_box = SurroundingRectangle(
            narration, fill_color=BLACK, fill_opacity=0.75,
            buff=0.3, corner_radius=0.15, stroke_width=0
        )
        narr_group = VGroup(bg_box, narration).to_edge(DOWN, buff=0.5)
        self.play(FadeIn(narr_group, shift=UP * 0.3), run_time=0.5)
        self.wait(1.5)


class TestudoDiagramScene(Scene):
    def setup(self):
        self.camera.background_color = PARCHMENT

    def construct(self):
        # Title
        title = Text(
            "VISTA SUPERIOR", font="Impact", font_size=56, color=DARK
        ).to_edge(UP, buff=0.5)
        self.play(Write(title), run_time=0.8)

        # Grid of shields from above
        grid = VGroup()
        for row in range(4):
            for col in range(5):
                shield = RoundedRectangle(
                    width=1.2, height=0.8, corner_radius=0.08,
                    fill_color=SHIELD_RED, fill_opacity=1,
                    stroke_color=GOLD, stroke_width=2
                ).move_to(LEFT * 2.4 + RIGHT * col * 1.3 + UP * 0.5 + DOWN * row * 0.9)
                emblem = Ellipse(
                    width=0.3, height=0.2, fill_color=GOLD,
                    fill_opacity=1, stroke_width=0
                ).move_to(shield)
                grid.add(VGroup(shield, emblem))

        self.play(
            LaggedStart(*[GrowFromCenter(s) for s in grid], lag_ratio=0.03),
            run_time=2
        )

        # Labels
        label_top = Text("ESCUDOS SUPERIORES", font="Arial", font_size=24, color=RED, weight=BOLD)
        label_top.next_to(grid, UP, buff=0.3)
        arrow_top = Arrow(label_top.get_bottom(), grid.get_top() + DOWN * 0.1, color=RED, stroke_width=2)

        label_left = Text("ESCUDOS\nLATERALES", font="Arial", font_size=20, color=RED, weight=BOLD)
        label_left.next_to(grid, LEFT, buff=0.4)
        arrow_left = Arrow(label_left.get_right(), grid.get_left() + RIGHT * 0.1, color=RED, stroke_width=2)

        label_right = Text("ESCUDOS\nLATERALES", font="Arial", font_size=20, color=RED, weight=BOLD)
        label_right.next_to(grid, RIGHT, buff=0.4)
        arrow_right = Arrow(label_right.get_left(), grid.get_right() + LEFT * 0.1, color=RED, stroke_width=2)

        self.play(
            FadeIn(label_top, shift=DOWN * 0.2), GrowArrow(arrow_top),
            FadeIn(label_left, shift=RIGHT * 0.2), GrowArrow(arrow_left),
            FadeIn(label_right, shift=LEFT * 0.2), GrowArrow(arrow_right),
            run_time=1
        )

        # Bottom badge
        badge_bg = RoundedRectangle(
            width=8, height=0.8, corner_radius=0.15,
            fill_color=GREEN, fill_opacity=1, stroke_width=0
        ).to_edge(DOWN, buff=0.5)
        badge_text = Text(
            "PROTECCIÓN 360° — IMPENETRABLE",
            font="Impact", font_size=36, color=WHITE
        ).move_to(badge_bg)

        self.play(
            FadeIn(badge_bg, shift=UP * 0.3),
            Write(badge_text),
            run_time=0.8
        )
        self.wait(2)
