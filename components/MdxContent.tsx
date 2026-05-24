import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import ExQ from "./ExQ";
import ExA from "./ExA";
import SHMDemo from "./Interactive/SHMDemo";
import TaylorDemo from "./Interactive/TaylorDemo";
import RiemannDemo from "./Interactive/RiemannDemo";
import DerivativeSecantDemo from "./Interactive/DerivativeSecantDemo";
import DampedOscillatorDemo from "./Interactive/DampedOscillatorDemo";
import GaussianUncertaintyDemo from "./Interactive/GaussianUncertaintyDemo";
import FourierSquareWaveDemo from "./Interactive/FourierSquareWaveDemo";
import QuantumWellDemo from "./Interactive/QuantumWellDemo";
import RCChargingDemo from "./Interactive/RCChargingDemo";

const components = {
  ExQ,
  ExA,
  SHMDemo,
  TaylorDemo,
  RiemannDemo,
  DerivativeSecantDemo,
  DampedOscillatorDemo,
  GaussianUncertaintyDemo,
  FourierSquareWaveDemo,
  QuantumWellDemo,
  RCChargingDemo,
};

const options = {
  mdxOptions: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: "github-dark-dimmed",
          keepBackground: true,
        },
      ],
    ],
  },
};

export default function MdxContent({ source }: { source: string }) {
  return (
    <div className="prose">
      {/* @ts-expect-error async RSC */}
      <MDXRemote source={source} options={options} components={components} />
    </div>
  );
}
