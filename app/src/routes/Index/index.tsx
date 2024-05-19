import { useEffect, useRef } from 'react';

import { useOnScreen } from '@hooks/useOnScreen.ts';
import { usePageSection } from '@hooks/usePageSection.ts';

import style from './style.module.css';

/**
 *
 * @description home page content inserted into the layout
 * @export
 * @return {*}  {JSX.Element}
 */
export function Index(): JSX.Element {
  // COMMENT: uses the custom hook usePageSection to retrieve the
  //  layout context
  const { setOutletContext } = usePageSection();
  // COMMENT: references to the HTML elements observed using the
  //  custom hook useOnScreen
  const homeRef = useRef<HTMLElement>(null);
  const workRef = useRef<HTMLElement>(null);
  const aboutRef = useRef<HTMLElement>(null);
  const servicesRef = useRef<HTMLElement>(null);

  const onHome = useOnScreen(homeRef, '-100px');
  const onWork = useOnScreen(workRef, '-100px');
  const onAbout = useOnScreen(aboutRef, '-100px');
  const onServices = useOnScreen(servicesRef, '-100px');
  // COMMENT: stores the result of observing HTML elements in the
  //  state passed with the layout context
  useEffect(() => {
    setOutletContext((prev) => ({ ...prev, onHome, onWork, onAbout, onServices }));
  }, [onAbout, onHome, onServices, onWork, setOutletContext]);

  return (
    <div className={style.wrapperIndex}>
      <section ref={homeRef}>
        <p id='p1'>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod eligendi labore laboriosam nesciunt voluptates
          officia sint possimus quae sed eum sunt unde, eveniet nulla, distinctio illum repudiandae fuga reiciendis
          dolorem! Lorem ipsum dolor sit amet consectetur, adipisicing elit. Asperiores, maiores exercitationem? Natus
          rerum exercitationem excepturi quibusdam optio incidunt, error quis sit numquam saepe cupiditate temporibus,
          tempore eveniet velit vero odit! Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        </p>
        <br />
        <p id='p2'>
          A vel, iusto similique ut soluta quaerat magnam non impedit rerum inventore tempora laborum excepturi at
          architecto deleniti consequuntur voluptate expedita quasi. Lorem ipsum dolor sit amet consectetur adipisicing
          elit. Earum deleniti, a provident hic placeat saepe! Adipisci aperiam rerum quia, doloremque eos consequatur
          laudantium dolorem, quasi atque, eveniet quibusdam vel eligendi. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Eum ipsa consectetur natus inventore quae error non, cum, neque perspiciatis dolorem
          temporased.
        </p>
      </section>
      <br />
      <section ref={workRef}>
        <p id='p3'>
          Error ab rerum earum labore atque veniam eveniet! Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Obcaecati nesciunt amet accusamus commodi eveniet numquam tempore reprehenderit quis. Officiis soluta
          voluptatibus officia ea maiores eveniet ipsum nulla eius ullam aliquam. Lorem ipsum dolor sit amet consectetur
          adipisicing elit. Rem ut facilis suscipit exercitationem eos debitis. Cupiditate voluptas impedit tempore
          quaerat repellendus ex aliquam reprehenderit deleniti, enim, voluptatibus, omnis consequatur magni? Lorem
          ipsum dolor sit amet consectetur adipisicing elit. Qui, quibusdam a? Officia, quas commodi nemo mollitia
          praesentium aliquam esse incidunt laboriosam cum illo a voluptates corporis sed molestias dolorem ex! Lorem
          ipsum dolor, sit amet consectetur adipisicing elit.
        </p>
        <br />
        <p id='p4'>
          Voluptates magni placeat, consectetur ratione, iusto qui tempora architecto, abanimi debitis a quis dolor
          doloremque blanditiis neque. Odio exercitationem mollitia eligendi. Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Corporis, ipsam! Ea dignissimos facilis animi quidem eius? Similique, ex quo necessitatibus
          soluta laudantium fugit sint dolor consectetur nemo culpa, fuga at!
        </p>
        <br />
        <p id='p5'>
          Voluptates magni placeat, consectetur ratione, iusto qui tempora architecto, abanimi debitis a quis dolor
          doloremque blanditiis neque. Odio exercitationem mollitia eligendi. Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Corporis, ipsam! Ea dignissimos facilis animi quidem eius? Similique, ex quo necessitatibus
          soluta laudantium fugit sint dolor consectetur nemo culpa, fuga at!
        </p>
      </section>
      <br />
      <section ref={aboutRef}>
        <p id='p6'>
          Voluptates magni placeat, consectetur ratione, iusto qui tempora architecto, abanimi debitis a quis dolor
          doloremque blanditiis neque. Odio exercitationem mollitia eligendi. Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Corporis, ipsam! Ea dignissimos facilis animi quidem eius? Similique, ex quo necessitatibus
          soluta laudantium fugit sint dolor consectetur nemo culpa, fuga at!
        </p>
        <br />
        <p id='p7'>
          Voluptates magni placeat, consectetur ratione, iusto qui tempora architecto, abanimi debitis a quis dolor
          doloremque blanditiis neque. Odio exercitationem mollitia eligendi. Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Corporis, ipsam! Ea dignissimos facilis animi quidem eius? Similique, ex quo necessitatibus
          soluta laudantium fugit sint dolor consectetur nemo culpa, fuga at!
        </p>
        <p id='p8'>
          Voluptates magni placeat, consectetur ratione, iusto qui tempora architecto, abanimi debitis a quis dolor
          doloremque blanditiis neque. Odio exercitationem mollitia eligendi. Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Corporis, ipsam! Ea dignissimos facilis animi quidem eius? Similique, ex quo necessitatibus
          soluta laudantium fugit sint dolor consectetur nemo culpa, fuga at!
        </p>
      </section>
      <br />
      <br />
      <section ref={servicesRef}>
        <p id='p9'>
          Voluptates magni placeat, consectetur ratione, iusto qui tempora architecto, abanimi debitis a quis dolor
          doloremque blanditiis neque. Odio exercitationem mollitia eligendi. Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Corporis, ipsam! Ea dignissimos facilis animi quidem eius? Similique, ex quo necessitatibus
          soluta laudantium fugit sint dolor consectetur nemo culpa, fuga at!
        </p>
        <br />
        <p id='p10'>
          Voluptates magni placeat, consectetur ratione, iusto qui tempora architecto, abanimi debitis a quis dolor
          doloremque blanditiis neque. Odio exercitationem mollitia eligendi. Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Corporis, ipsam! Ea dignissimos facilis animi quidem eius? Similique, ex quo necessitatibus
          soluta laudantium fugit sint dolor consectetur nemo culpa, fuga at!
        </p>
        <br />
        <p id='p11'>
          Voluptates magni placeat, consectetur ratione, iusto qui tempora architecto, abanimi debitis a quis dolor
          doloremque blanditiis neque. Odio exercitationem mollitia eligendi. Lorem ipsum, dolor sit amet consectetur
          adipisicing elit. Corporis, ipsam! Ea dignissimos facilis animi quidem eius? Similique, ex quo necessitatibus
          soluta laudantium fugit sint dolor consectetur nemo culpa, fuga at!
        </p>
      </section>
    </div>
  );
}
